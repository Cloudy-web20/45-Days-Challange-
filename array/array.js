const skills = [
{ name: "HTML", proficiency: "Intermediate" },
{ name: "CSS", proficiency: "Advanced" },
{ name: "JavaScript", proficiency: "Beginner" }
];
function formatSkills(skillsArray) {
return skillsArray.map(skill => {
return "${skill.name} (${skill.proficiency})";
});
}
const formattedSkills = formatSkills(skills);
console.log(formattedSkills);

