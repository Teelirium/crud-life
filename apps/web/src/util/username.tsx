export function getName() {
  const name = localStorage.getItem('clientName');
  if (!name) {
    return getNewName();
  }
  return name;
}

export function getNewName() {
  const newName = crypto.randomUUID();
  localStorage.setItem('clientName', newName);
  return newName;
}
