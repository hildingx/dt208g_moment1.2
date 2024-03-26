//Definiera kontrakt för objekt 
interface Course {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}

//Deklarera DOM-referenser
const courseForm = document.getElementById('courseForm') as HTMLFormElement;
const courseListEl = document.getElementById('courseList') as HTMLElement;

const codeInput = document.getElementById('code') as HTMLInputElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const progressionSelect = document.getElementById('progression') as HTMLSelectElement;
const syllabusInput = document.getElementById('syllabus') as HTMLInputElement;

//Funktion för att lägga till kurs
function addCourse(): void {
    //Objekt som följer struktur definierad av course-interfacet
    const newCourse: Course = {
        code: codeInput.value,
        name: nameInput.value,
        progression: progressionSelect.value as 'A' | 'B' | 'C',
        syllabus: syllabusInput.value
    };

    //Hämta kurser från localStorage
    let courses = getCourses();

    //Kontrollera om kurskoden redan finns
    const codeExists = courses.some(course => course.code === newCourse.code);

    if (codeExists) {
        alert('En kurs med denna kod finns redan. Ange en unik kurskod.');
        return;
    }

    //Lägg till den nya kursen i listan
    courses.push(newCourse);

    //Spara den uppdaterade listan till localStorage
    saveCourses(courses);

    //Uppdatera DOM
    renderCourses();
}

//Händelsehanterare som kör funktion addCourse vid submit av formulär
courseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addCourse();
});

