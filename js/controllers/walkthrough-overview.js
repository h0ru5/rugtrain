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
});

guiders.createGuider({
  attachTo: ".navbar-inner button:visible",
  highlight : ".navbar-inner button:visible",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Gib zum Anmelden einfach deinen Namen hier oben ein (nach ein paar Buchstaben sollte eine Auswahl kommen) und klicke den button",
  id: "login",
  next: "shoutbox",
  overlay: true,
  position : 6,
  offset : { left: -100, top:0},
  title: "An- und Abmelden"
});

guiders.createGuider({
  attachTo: "#shoutbox",
  highlight : "#shoutbox",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "In der Shoutbox kann man kurze Nachrichten hinterlassen, ähnlich wie bisher die Kommentare, aber unabhängig von einem Termin.<br/> Es werden die letzten fünf angezeigt, der Rest ist im Archiv",
  id: "shoutbox",
  next: "overview",
  overlay: true,
  position : 12,
  title: "Shoutbox"
});

guiders.createGuider({
  attachTo: "#nextEvent",
  highlight: "#nextEvent",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Hier wird eine kurze Zusammenfassung über den nächsten Termin dargestellt, der Button führt zur Detailseite",
  id: "nextEvent",
  next: "fin",
  overlay: true,
  position : 12,
  title: "Nächster Termin"
});

guiders.createGuider({
  attachTo: "#overview",
  highlight: "#overview",
  autoFocus : true,
  buttons: [{name: "Weiter", onclick : guiders.next },{name : "Abbrechen",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "In der Übersicht werden die nächsten 5 Termine angezeigt, alle weitern Termine kann man über den Link erreichen",
  id: "overview",
  next: "nextEvent",
  overlay: true,
  position : 12,
  title: "Übersicht"
});

guiders.createGuider({
  buttons: [{name : "Ende",onclick : guiders.hideAll},{name : "Zur&uuml;ck",onclick : guiders.prev}],
  description: "Das war die Tour für die Übersichtsseite, für die Unterseiten gibt es eigene Touren",
  id: "fin",
  overlay: true,
  title: "Ende der Tour"
});
