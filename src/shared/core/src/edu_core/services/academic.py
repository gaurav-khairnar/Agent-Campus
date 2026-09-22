"""Academic Operations Service for AgentCampus."""

from contextlib import contextmanager
from datetime import datetime, timezone
from uuid import uuid4

from edu_db.models import (
    Assignment,
    Attendance,
    Course,
    Department,
    Enrollment,
    Institution,
    Notice,
    Submission,
    Timetable,
)
from edu_db.session import get_session_factory
from edu_core.exceptions import NotFoundError


class AcademicService:
    """Service for managing Academic Domain Entities (Institutions, Courses, Attendance, etc.)."""

    def __init__(self) -> None:
        pass

    @contextmanager
    def _get_db_session(self):
        SessionLocal = get_session_factory()
        db = SessionLocal()
        try:
            yield db
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    # --- Institutions & Departments ---

    def create_institution(self, name: str, code: str, domain: str | None = None, settings: dict | None = None) -> dict:
        with self._get_db_session() as db:
            inst = Institution(
                id=str(uuid4()),
                name=name,
                code=code.upper(),
                domain=domain,
                settings=settings or {},
            )
            db.add(inst)
            db.commit()
            return {"id": inst.id, "name": inst.name, "code": inst.code, "domain": inst.domain}

    def list_institutions(self) -> list[dict]:
        with self._get_db_session() as db:
            institutions = db.query(Institution).order_by(Institution.created_at.desc()).all()
            return [{"id": i.id, "name": i.name, "code": i.code, "domain": i.domain, "settings": i.settings} for i in institutions]

    def create_department(self, institution_id: str, name: str, code: str) -> dict:
        with self._get_db_session() as db:
            dept = Department(
                id=str(uuid4()),
                institution_id=institution_id,
                name=name,
                code=code.upper(),
            )
            db.add(dept)
            db.commit()
            return {"id": dept.id, "institution_id": dept.institution_id, "name": dept.name, "code": dept.code}

    def list_departments(self, institution_id: str) -> list[dict]:
        with self._get_db_session() as db:
            depts = db.query(Department).filter(Department.institution_id == institution_id).all()
            return [{"id": d.id, "institution_id": d.institution_id, "name": d.name, "code": d.code} for d in depts]

    # --- Courses & Enrollments ---

    def create_course(
        self,
        institution_id: str,
        code: str,
        name: str,
        description: str | None = None,
        credits: int = 3,
        department_id: str | None = None,
        faculty_id: str | None = None,
    ) -> dict:
        with self._get_db_session() as db:
            course = Course(
                id=str(uuid4()),
                institution_id=institution_id,
                department_id=department_id,
                code=code.upper(),
                name=name,
                description=description,
                credits=credits,
                faculty_id=faculty_id,
            )
            db.add(course)
            db.commit()
            return {
                "id": course.id,
                "institution_id": course.institution_id,
                "code": course.code,
                "name": course.name,
                "description": course.description,
                "credits": course.credits,
                "faculty_id": course.faculty_id,
            }

    def list_courses(
        self,
        institution_id: str,
        department_id: str | None = None,
        faculty_id: str | None = None,
    ) -> list[dict]:
        with self._get_db_session() as db:
            query = db.query(Course).filter(Course.institution_id == institution_id)
            if department_id:
                query = query.filter(Course.department_id == department_id)
            if faculty_id:
                query = query.filter(Course.faculty_id == faculty_id)
            courses = query.order_by(Course.code.asc()).all()
            return [
                {
                    "id": c.id,
                    "institution_id": c.institution_id,
                    "code": c.code,
                    "name": c.name,
                    "description": c.description,
                    "credits": c.credits,
                    "faculty_id": c.faculty_id,
                }
                for c in courses
            ]

    def enroll_student(self, institution_id: str, course_id: str, student_id: str) -> dict:
        with self._get_db_session() as db:
            existing = (
                db.query(Enrollment)
                .filter(
                    Enrollment.institution_id == institution_id,
                    Enrollment.course_id == course_id,
                    Enrollment.student_id == student_id,
                )
                .first()
            )
            if existing:
                return {"id": existing.id, "status": existing.status, "message": "Already enrolled"}

            enrollment = Enrollment(
                id=str(uuid4()),
                institution_id=institution_id,
                course_id=course_id,
                student_id=student_id,
                status="active",
            )
            db.add(enrollment)
            db.commit()
            return {"id": enrollment.id, "course_id": course_id, "student_id": student_id, "status": "active"}

    # --- Timetables & Attendance ---

    def create_timetable_entry(
        self,
        institution_id: str,
        course_id: str,
        day_of_week: str,
        start_time: str,
        end_time: str,
        room: str | None = None,
    ) -> dict:
        with self._get_db_session() as db:
            entry = Timetable(
                id=str(uuid4()),
                institution_id=institution_id,
                course_id=course_id,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time,
                room=room,
            )
            db.add(entry)
            db.commit()
            return {
                "id": entry.id,
                "course_id": entry.course_id,
                "day_of_week": entry.day_of_week,
                "start_time": entry.start_time,
                "end_time": entry.end_time,
                "room": entry.room,
            }

    def list_timetable(self, institution_id: str, course_id: str | None = None) -> list[dict]:
        with self._get_db_session() as db:
            query = db.query(Timetable).filter(Timetable.institution_id == institution_id)
            if course_id:
                query = query.filter(Timetable.course_id == course_id)
            entries = query.all()
            return [
                {
                    "id": e.id,
                    "course_id": e.course_id,
                    "day_of_week": e.day_of_week,
                    "start_time": e.start_time,
                    "end_time": e.end_time,
                    "room": e.room,
                }
                for e in entries
            ]

    def record_attendance(
        self,
        institution_id: str,
        course_id: str,
        student_id: str,
        status: str,
        marked_by: str | None = None,
    ) -> dict:
        with self._get_db_session() as db:
            att = Attendance(
                id=str(uuid4()),
                institution_id=institution_id,
                course_id=course_id,
                student_id=student_id,
                status=status,
                marked_by=marked_by,
                date=datetime.now(timezone.utc),
            )
            db.add(att)
            db.commit()
            return {
                "id": att.id,
                "course_id": att.course_id,
                "student_id": att.student_id,
                "status": att.status,
                "date": att.date.isoformat(),
            }

    def list_attendance(self, institution_id: str, course_id: str, student_id: str | None = None) -> list[dict]:
        with self._get_db_session() as db:
            query = db.query(Attendance).filter(
                Attendance.institution_id == institution_id,
                Attendance.course_id == course_id,
            )
            if student_id:
                query = query.filter(Attendance.student_id == student_id)
            records = query.order_by(Attendance.date.desc()).all()
            return [
                {
                    "id": a.id,
                    "course_id": a.course_id,
                    "student_id": a.student_id,
                    "status": a.status,
                    "date": a.date.isoformat(),
                    "marked_by": a.marked_by,
                }
                for a in records
            ]

    # --- Assignments & Submissions ---

    def create_assignment(
        self,
        institution_id: str,
        course_id: str,
        title: str,
        description: str | None = None,
        due_date: datetime | None = None,
        created_by: str | None = None,
    ) -> dict:
        with self._get_db_session() as db:
            assign = Assignment(
                id=str(uuid4()),
                institution_id=institution_id,
                course_id=course_id,
                title=title,
                description=description,
                due_date=due_date,
                created_by=created_by,
            )
            db.add(assign)
            db.commit()
            return {
                "id": assign.id,
                "course_id": assign.course_id,
                "title": assign.title,
                "description": assign.description,
                "due_date": assign.due_date.isoformat() if assign.due_date else None,
            }

    def submit_assignment(
        self,
        assignment_id: str,
        student_id: str,
        file_url: str | None = None,
    ) -> dict:
        with self._get_db_session() as db:
            sub = Submission(
                id=str(uuid4()),
                assignment_id=assignment_id,
                student_id=student_id,
                file_url=file_url,
                submitted_at=datetime.now(timezone.utc),
            )
            db.add(sub)
            db.commit()
            return {
                "id": sub.id,
                "assignment_id": sub.assignment_id,
                "student_id": sub.student_id,
                "submitted_at": sub.submitted_at.isoformat(),
            }

    def list_assignments(self, institution_id: str, course_id: str) -> list[dict]:
        with self._get_db_session() as db:
            assignments = (
                db.query(Assignment)
                .filter(
                    Assignment.institution_id == institution_id,
                    Assignment.course_id == course_id,
                )
                .order_by(Assignment.created_at.desc())
                .all()
            )
            return [
                {
                    "id": a.id,
                    "course_id": a.course_id,
                    "title": a.title,
                    "description": a.description,
                    "due_date": a.due_date.isoformat() if a.due_date else None,
                }
                for a in assignments
            ]

    # --- Notices & Announcements ---

    def create_notice(
        self,
        institution_id: str,
        title: str,
        content: str,
        target_role: str = "all",
        created_by: str | None = None,
        is_published: bool = False,
    ) -> dict:
        with self._get_db_session() as db:
            notice = Notice(
                id=str(uuid4()),
                institution_id=institution_id,
                title=title,
                content=content,
                target_role=target_role,
                created_by=created_by,
                is_published=is_published,
            )
            db.add(notice)
            db.commit()
            return {
                "id": notice.id,
                "title": notice.title,
                "target_role": notice.target_role,
                "is_published": notice.is_published,
            }

    def list_notices(self, institution_id: str, role: str = "all") -> list[dict]:
        with self._get_db_session() as db:
            query = db.query(Notice).filter(
                Notice.institution_id == institution_id,
                Notice.is_published.is_(True),
            )
            if role != "admin":
                query = query.filter((Notice.target_role == "all") | (Notice.target_role == role))
            notices = query.order_by(Notice.created_at.desc()).all()
            return [
                {
                    "id": n.id,
                    "title": n.title,
                    "content": n.content,
                    "target_role": n.target_role,
                    "created_at": n.created_at.isoformat(),
                }
                for n in notices
            ]
