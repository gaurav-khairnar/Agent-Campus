"""Background worker processor for bulk academic data imports."""

from edu_core.services.academic import AcademicService
from processors.base import BaseProcessor
from rich.console import Console

console = Console(force_terminal=True)


class BulkImportProcessor(BaseProcessor[dict]):
    """Processor for importing bulk academic data (departments, courses, timetables)."""

    def __init__(self, academic_service: AcademicService) -> None:
        self.academic_service = academic_service

    async def process(self, payload: dict) -> None:
        institution_id = payload.get("institution_id")
        import_data = payload.get("data", {})

        if not institution_id:
            raise ValueError("Missing institution_id in bulk import payload")

        console.log(f"[bold blue]Bulk import starting for institution: {institution_id}[/bold blue]")

        # Import departments
        for dept in import_data.get("departments", []):
            self.academic_service.create_department(institution_id, dept["name"], dept["code"])

        # Import courses
        for course in import_data.get("courses", []):
            self.academic_service.create_course(
                institution_id=institution_id,
                code=course["code"],
                name=course["name"],
                description=course.get("description"),
                credits=course.get("credits", 3),
            )

        console.log(f"[bold green]Bulk import completed for institution: {institution_id}[/bold green]")
