function fieldFormatter(field) {
  return `- name: ${field.name}\n  value: "${field.value}"`;
}

function debugHiddenFields(form) {
  const hiddenFields = Array.prototype.slice
    .call(form.querySelectorAll("[type=hidden]"))
    .sort(function sortAscending(a, b) {
      return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;  
    });
  const groupName = `<form action="${  form.getAttribute("action")  }">`;
  const fieldData = hiddenFields.map(fieldFormatter);

  return `${groupName  }\n${  fieldData.join("\n")}`;
}

if (console) {
  if (console.groupCollapsed) {
    console.groupCollapsed("Hidden fields");
  }

  const hiddenFieldData = Array.from(document.querySelectorAll("form")).map(
    debugHiddenFields
  );
  console.log(hiddenFieldData.join("\n\n\n"));

  if (console.groupEnd) {
    console.groupEnd();
  }
}
