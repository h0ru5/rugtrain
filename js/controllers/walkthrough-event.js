function startWalkThrough() {
    guiders.show("first");
}

guiders.createGuider({
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll}],
  description: "Willst du eine Tour über die Besienung der Ansicht?",
  id: "first",
  next: "login",
  overlay: true,
  title: "Willkommen auf der neuen Ansicht der Trainingsseite!"
}).show();

guiders.createGuider({
  attachTo: ".navbar-inner button:visible",
  highlight : ".navbar-inner button:visible",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Gib zum Anmelden einfach deinen Namen hier oben ein (nach ein paar Buchstaben sollte eine Auswahl kommen) und klicke den button",
  id: "login",
  next: "pagehead",
  overlay: true,
  position : 6,
  offset : { left: -100, top:0},
  title: "An- und Abmelden"
});

guiders.createGuider({
  attachTo: ".page-header",
  highlight : ".page-header",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "In der Überschrift stehen Typ, Ort und Zeit der Veranstaltung",
  id: "pagehead",
  next: "zfsg",
  overlay: true,
  position : 6,
  title: "Titelzeile"
});

guiders.createGuider({
  attachTo: "#zfsg",
  highlight: "#zfsg",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Hier wird eine kurze Zusammenfassung über den nächsten Termin dargestellt, ein klick auf die Zeile des Eintrags öffnet eine Liste der Leute",
  id: "zfsg",
  next: "vote",
  overlay: true,
  position : 12,
  title: "Zusammenfassung"
});

guiders.createGuider({
  attachTo: "#vote",
  highlight: "#vote",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Für die Abstimmung muss man angemeldet sein. Einfach einen der drei Knöpfe drücken, der aktuelle aktive erscheint größer",
  id: "vote",
  next: "comment",
  overlay: true,
  position : 12,
  title: "Abstimmung"
});

guiders.createGuider({
  attachTo: "#comment",
  highlight: "#comment",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Hier erscheinen die Kommentare, einen neuen fügt man unter 'Neu...' ein (Man muss dazu angemeldet sein). ",
  id: "comment",
  next: "fin",
  overlay: true,
  position : 12,
  title: "Kommentare"
});

guiders.createGuider({
  buttons: [{name : "Ende",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Das war die Tour, sie kann jederzeit übet den Menüpunkt 'Tour' abgerufen werden",
  id: "fin",
  overlay: true,
  title: "Ende der Tour"
});
