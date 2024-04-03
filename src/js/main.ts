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

    //Validera input så inga fält är tomma
    if (!codeInput.value.trim() || !nameInput.value.trim() ||  !syllabusInput.value.trim()) {
        alert('Alla fält måste vara ifyllda.')
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

//Funktion för att spara kurstata till localstorage
function saveCourses(courses: Course[]) {
    localStorage.setItem('courses', JSON.stringify(courses));
}

//Funktion för att hämta kursdata från localstorage
function getCourses(): Course[] {
    const coursesJSON = localStorage.getItem('courses');
    return coursesJSON ? JSON.parse(coursesJSON) : [];
}

//Funktion för att uppdatera DOM med data från localstorage
function renderCourses(): void {
    //Hämta lista av kursobjekt från localstorage
    const courses = getCourses();
    let coursesHTML = '';

    //Loopa och skriv ut kursinfo från kursobjekt
    courses.forEach(course => {
        coursesHTML += `
            <span class="line"></span>
            <div class="courseContainer">
                <p><strong>Kurskod:</strong> ${course.code}</p>
                <p><strong>Namn:</strong> ${course.name}</p>                
                <p><strong>Progression:</strong> ${course.progression}</p>
                <p><strong>Kursplan:</strong> <a href="${course.syllabus}" target="_blank">Länk</a></p>
                <div class="buttonContainer">
                    <button class="edit-button button button--grey" data-code="${course.code}">Redigera</button>
                    <button class="delete-button button button--yellow" data-code="${course.code}">Ta bort</button>
                </div>
            </div>
        `;
    });

    courseListEl.innerHTML = coursesHTML;

    //Händelselyssnare för ändra-knapp. Vid klick kör funktion editcourse med coursecode som argument
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            const courseCode = this.getAttribute('data-code');
            if (courseCode) {
                editCourse(courseCode);
            }
        });
    });

    //Händelselyssnare för ta bort-knapp
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const courseCode = this.getAttribute('data-code');
            if (courseCode) {
                deleteCourse(courseCode);
            }
        });
    });
}

//Funktion för att ta bort kurs
function deleteCourse(courseCode: string): void {
    //Hämta befintliga kurser
    let courses = getCourses();

    //Filtrera ut kurs som ska tas bort
    courses = courses.filter(course => course.code !== courseCode);

    //Spara ner i localstorage
    saveCourses(courses);

    //Uppdatera DOM
    renderCourses();
}

//Direktanropar funktion för att uppdatera DOM med ev. data från localstorage
renderCourses();

//Funktion för att hämta kurs som ska ändras och visa redigeraformulär
function editCourse(courseCode: string): void {
    const courses = getCourses();
    const courseToEdit = courses.find(course => course.code === courseCode);

    if (courseToEdit) {
        (document.getElementById('editForm') as HTMLElement).style.display = 'block';
        (document.querySelector('.overlay') as HTMLElement).style.display = 'block';
        (document.getElementById('editCode') as HTMLInputElement).value = courseToEdit.code;
        (document.getElementById('editName') as HTMLInputElement).value = courseToEdit.name;
        (document.getElementById('editProgression') as HTMLSelectElement).value = courseToEdit.progression;
        (document.getElementById('editSyllabus') as HTMLInputElement).value = courseToEdit.syllabus;

        //Sparaknappen för att lyssna på klick och uppdatera kursen
        (document.getElementById('saveEdit') as HTMLButtonElement).onclick = function() {
            updateCourse(courseCode);
        };
    }
}

//Funktion för att uppdatera en kurs
function updateCourse(originalCode: string): void {
    //Hämta DOM-referenser
    const codeInput = document.getElementById('editCode') as HTMLInputElement;
    const nameInput = document.getElementById('editName') as HTMLInputElement;
    const progressionSelect = document.getElementById('editProgression') as HTMLSelectElement;
    const syllabusInput = document.getElementById('editSyllabus') as HTMLInputElement;
    const editForm = document.getElementById('editForm') as HTMLElement;

    //Kontrollera att alla element finns
    if (codeInput && nameInput && progressionSelect && syllabusInput && editForm) {
        const updatedCourse: Course = {
            code: codeInput.value,
            name: nameInput.value,
            progression: progressionSelect.value as 'A' | 'B' | 'C',
            syllabus: syllabusInput.value
        };

        let courses = getCourses();

        //Kontrollera om den nya kurskoden redan är inlagd
        const codeExists = courses.some(course => course.code === updatedCourse.code && course.code !== originalCode);

        if (codeExists) {
            alert('En kurs med denna kod finns redan. Ange en unik kurskod.');
            return;
        }
        
        if (!codeInput.value.trim() || !nameInput.value.trim() ||  !syllabusInput.value.trim()) {
            alert('Alla fält måste vara ifyllda.')
            return;
        }

        //Hitta index för kurs som ska uppdateras
        const courseIndex = courses.findIndex(course => course.code === originalCode);
        //Uppdatera kursen i listan och i DOM
        if (courseIndex !== -1) {
            courses[courseIndex] = updatedCourse;
            saveCourses(courses);
            renderCourses();
        }
    } else {
        console.error('Ett eller flera element kunde inte hittas i DOM');
    }
}

// Lägg till en händelsehanterare för att dölja formuläret och overlay när användaren sparar ändringarna
(document.getElementById('saveEdit') as HTMLButtonElement).addEventListener('click', function() {
    (document.getElementById('editForm') as HTMLElement).style.display = 'none';
    (document.querySelector('.overlay') as HTMLElement).style.display = 'none';
});