export type Textbaustein = {
  id: string;
  title: string;
  content: string;
};

// Official response templates (Textbausteine) organized by case category.
// These are the standard texts agents use when composing replies.
export const TEXTBAUSTEINE_BY_CATEGORY: Record<string, Textbaustein[]> = {
  sperrmuell: [
    {
      id: "sperr-termin-bestaetigt",
      title: "Abrufauftrag Sperrmüll – Termin bestätigt",
      content: `der nächstmögliche kostenfreie Termin für die Abfuhr von Sperrmüll ist [DATUM]. Diesen Termin habe ich fest für Sie gebucht. Bitte teilen Sie es uns mit, wenn Sie den Termin nicht in Anspruch nehmen möchten. Eine Terminbestätigung ist nicht notwendig.

WICHTIGER HINWEIS:

Bitte stellen Sie die Gegenstände am Abfuhrtag rechtzeitig bis 6:00 Uhr so bereit, dass das Entsorgungsfahrzeug auf öffentlichen oder dem öffentlichen Verkehr dienenden privaten Straßen an die Aufstellplätze heranfahren kann und das Laden sowie der Abtransport ohne Schwierigkeiten und Zeitverlust möglich sind. Sperrmüll wird nicht von privaten Grundstücken abgeholt.

Bei der Sperrmüllabfuhr nehmen wir große Einrichtungs- und Gebrauchsgegenstände mit, mit denen ein Haushalt üblicherweise ausgestattet ist, sowie Gegenstände, die so sperrig sind, dass sie das Volumen des Restabfallbehälters übersteigen.
Es werden bei einem Termin maximal 5 m³ Sperrmüll mitgenommen. Die Gegenstände dürfen nicht größer als 2 m (max. Länge) x 1 m x 0,75 m sein und bis zu 70 kg wiegen.
Aufgrund der Verletzungsgefahr für die Müllwerker bleiben Glas- und Spiegelelemente stehen. Dies gilt auch für gefüllte Säcke und Kartons.

Selbstverständlich haben Sie auch die Möglichkeit, einen kostenpflichtigen Sperrmüll-Express-Termin zu buchen. Hier erhalten Sie einen Wunschtermin innerhalb von drei Arbeitstagen. Bei Interesse melden Sie sich gerne telefonisch. Bitte halten Sie dann Ihre Bankverbindung bereit.

Auch unsere Recyclinghöfe nehmen Sperrmüll bis max. 2 m³ pro Monat kostenfrei an.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "sperr-frueherer-termin-nicht-moeglich",
      title: "Sperrmüll – Früherer Termin nicht möglich",
      content: `leider kann ich Ihnen keinen früheren kostenfreien Termin für die Abfuhr von Sperrmüll anbieten.

Sie haben die Möglichkeit, einen kostenpflichtigen Sperrmüll-Express-Termin zu vereinbaren, dieser könnte innerhalb von 3 bis 4 Arbeitstagen stattfinden. Diese Sonderleistung (Abholung vom öffentlichen Fahrbahnrand) wird mit einer Grundpauschale von … EUR für die Anfahrt und Entsorgung von bis zu 5 m³ berechnet, jeder weitere angefangene Kubikmeter Sperrmüll darüber hinaus wird mit … EUR zusätzlich berechnet.

Bei Auftragserteilung benötige ich von Ihnen eine Rechnungsadresse (bei Umzug: Neue Anschrift) sowie die Angabe Ihrer Bankverbindung (IBAN), da der Rechnungsbetrag nach Erhalt der Rechnung per Lastschrift von Ihrem Konto abgebucht wird.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "sperr-anfrage-ohne-angaben",
      title: "Sperrmüll – Anfrage ohne Angaben",
      content: `wenn Sie einen Termin für die Abfuhr von Sperrmüll buchen möchten, benötige ich von Ihnen noch folgende Angaben:

- Ort, Straße, Hausnummer
- Gegenstände, die abgeholt werden sollen
- ggf. abweichender Standort

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
  ],

  abholung_verpasst: [
    {
      id: "keine-nachleerg-bio-ra",
      title: "Keine Nachleerung möglich (Bio/Restabfall)",
      content: `Sie hatten uns mitgeteilt, dass Ihr Abfallbehälter nicht geleert wurde. Dieses bedauere ich sehr, denn es ist uns grundsätzlich an einer ordnungsgemäßen Entsorgung der Abfälle gelegen.

Leider ist eine Nachleerung aus logistischen Gründen nicht möglich.
Ich sende Ihnen einen Amtlichen Abfallsack zu, damit Sie darin bis zum nächsten regulären Leerungstermin Ihre Abfälle sammeln können. Der Sack wird dann bei der nächsten Abfuhr mitgenommen.`,
    },
    {
      id: "keine-nachleerg-altpapier",
      title: "Keine Nachleerung Altpapier",
      content: `ich bedauere sehr, dass Ihr Papierbehälter nicht geleert wurde. Leider ist eine Nachleerung aus logistischen Gründen nicht möglich. Es wird angeboten, bei der nächsten Leerung des Altpapierbehälters Beistellungen – z. B. in einem Karton – zusätzlich mitzunehmen.

Alternativ können Sie die öffentlichen Depotcontainer nutzen oder Ihr Altpapier kostenfrei auf einem Recyclinghof entsorgen.`,
    },
    {
      id: "bearbeitungsstand",
      title: "Beschwerde – Bearbeitungsstand",
      content: `vielen Dank für Ihre Mitteilung. Ich habe Ihre Entsorgungsbeschwerde aufgenommen. Sobald eine Stellungnahme bzw. Information des Entsorgungsunternehmens vorliegt, werde ich Sie benachrichtigen. Bitte lassen Sie den Behälter am Fahrbahnrand stehen.`,
    },
  ],

  tonnentausch: [
    {
      id: "behaelterummeldung-einzel",
      title: "Behälterummeldung – Einzelner Behälter",
      content: `Ihr Auftrag zum Behältertausch bzw. zur Behälterlieferung ist bei uns eingegangen und wird zu [DATUM] berücksichtigt.
Einen konkreten Auslieferungstermin kann ich Ihnen leider nicht mitteilen.

Bitte unterstützen Sie unser Behälterteam, indem Sie den Behälter bis zum Tausch gut sichtbar und frei zugänglich an der Grundstücksgrenze bereitstellen.
In der Zwischenzeit kann der zu tauschende Behälter natürlich weiter befüllt und zur Abfuhr gestellt werden.

Der Tarif für den Größentausch eines Behälters bis 240 L beträgt 10,00 €.
Eine Änderungsrechnung geht Ihnen in Kürze zu.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "behaeltertausch-verschmutzung",
      title: "Behältertausch wg. Verschmutzung/Maden",
      content: `Ihr Auftrag zum Behältertausch wegen Verschmutzung ist bei uns eingegangen.
Einen konkreten Auslieferungstermin kann ich Ihnen leider nicht mitteilen.

Bitte unterstützen Sie unser Behälterteam, indem Sie die Behälter bis zum Tausch gut sichtbar und frei zugänglich an der Grundstücksgrenze bereitstellen.
In der Zwischenzeit kann der zu tauschende Behälter natürlich weiter befüllt und zur Abfuhr gestellt werden.

Der Tarif für den Tausch eines Behälters bis 240 L aufgrund von Verschmutzung beträgt 20,00 €.
Eine Änderungsrechnung geht Ihnen in Kürze zu.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
  ],

  rechnung: [
    {
      id: "mahnung-15-03",
      title: "Mahnung trotz Zahlung – Fälligkeit 15.03.",
      content: `Sie haben eine Mahnung erhalten, weil zum Fälligkeitstermin 15.03. nicht der gesamte Betrag, sondern nur das 1. Quartal gezahlt wurde. Die Fälligkeitstermine sind ab 2021 auf zwei im Jahr umgestellt worden, die Termine sind der 15.03. und der 15.09. Wenn Sie einen Dauerauftrag eingerichtet haben, bitte entsprechend anpassen.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "mahnung-15-09",
      title: "Mahnung trotz Zahlung – Fälligkeit 15.09.",
      content: `Sie haben eine Mahnung erhalten, weil zum Fälligkeitstermin 15.09. nicht der gesamte Betrag, sondern nur das 3. Quartal gezahlt wurde. Die Fälligkeitstermine sind ab 2021 auf zwei im Jahr umgestellt worden, die Termine sind der 15.03. und der 15.09. Wenn Sie einen Dauerauftrag eingerichtet haben, bitte entsprechend anpassen.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "abschlagszahlungen-aenderung",
      title: "Abschlagszahlungen – Änderung nicht möglich",
      content: `Ihrem Wunsch, vierteljährlich abzubuchen, können wir leider nicht entsprechen. Die Abbuchungen werden automatisch vom System vorgenommen. Wir haben diese Änderung vorgenommen, um den Verwaltungsaufwand und die Kosten zu reduzieren. Wie Ihnen bekannt ist, kostet jede Buchung auf einem Konto derzeit mind. € 0,25. Das macht bei ca. 120.000 Buchungen schon eine große Summe aus. Die Höhe der Zahlbeträge lässt dies aus unserer Sicht zu.

Es ist uns immer ein Anliegen, wirtschaftlich zu arbeiten.`,
    },
  ],

  adressaenderung: [
    {
      id: "eigentumswechsel-kaeufer",
      title: "Eigentumswechsel – Käufer",
      content: `vielen Dank für Ihre Mitteilung über den Eigentumswechsel.
Sie erhalten demnächst eine Jahresrechnung zur Abfallentsorgung sowie ein SEPA-Lastschriftmandat.

Die Abfuhrtermine können Sie sich auch auf unserer Homepage anzeigen lassen, als PDF-Datei ausdrucken oder den persönlichen Kalender exportieren (ics).
Oder Sie nutzen auf Ihrem Smartphone unsere App "AWSH Wertvolle Termine", um sich an alle Termine erinnern zu lassen. Terminverschiebungen durch Feiertage wurden bereits berücksichtigt.

Die vorhandenen Abfallbehälter haben wir auf Sie übertragen. Wünschen Sie Änderungen des bestehenden Behälterbestandes, beauftragen Sie diese bitte per Mail oder telefonisch.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "eigentumswechsel-verkaeufer",
      title: "Eigentumswechsel – Verkäufer",
      content: `vielen Dank für Ihre Mitteilung über den Eigentumswechsel.
Sie erhalten demnächst Ihre Änderungsrechnung.

Bitte geben Sie Ihre neue Adresse an, da unsere Post aufgrund einer Vorausverfügung nicht nachgesandt wird.`,
    },
    {
      id: "eigentumswechsel-ohne-angaben",
      title: "Eigentumswechsel – Angaben der neuen Eigentümer fehlen",
      content: `danke für Ihre Mail, leider fehlen zur Durchführung des Eigentumswechsels die Angaben über die neuen Eigentümer (Vor- und Zuname, aktuelle Adresse). Bitte teilen Sie uns diese noch mit.

Nutzen Sie gerne unsere Homepage – Sie finden alle Formulare unter https://www.awsh.de/kontakt/kontakt-privatkunden

Bitte geben Sie auch Ihre neue Adresse an, da unsere Post aufgrund einer Vorausverfügung nicht nachgesandt wird.`,
    },
  ],

  beschwerde: [
    {
      id: "beschwerde-behaelter-nicht-zurueckgestellt",
      title: "Beschwerde: Behälter nicht richtig zurückgestellt",
      content: `ich habe Ihr Schreiben erhalten und bedauere sehr, dass Sie Grund zur Beanstandung haben.

Die Müllwerker sind angewiesen, die Behälter nach der Leerung grundsätzlich dort wieder abzustellen, wo sie auch zur Leerung bereitgestellt waren. Ich habe das für uns tätige Entsorgungsunternehmen von Ihrem Schreiben in Kenntnis gesetzt. Das Unternehmen hat mir versichert, mit dem verantwortlichen Team zu sprechen, und Abhilfe zugesichert.
Ich hoffe, dass für die Zukunft alles reibungslos klappt.`,
    },
    {
      id: "beschwerde-bioabfall-festgefroren",
      title: "Beschwerde: Bioabfall festgefroren",
      content: `Sie schildern uns Ihr Problem mit der Abfuhr Ihres Bioabfalls. Dieses bedauern wir sehr, denn es ist uns grundsätzlich an einer ordnungsgemäßen Entsorgung der Abfälle gelegen.

Selbstverständlich sollen auch während Frostperioden Entsorgungsleistungen erbracht werden.
Mit sinkenden Temperaturen kann es allerdings zu Problemen mit eingefrorenen Abfallbehältern kommen. Schon bei Temperaturen um den Gefrierpunkt frieren feuchte Inhaltsstoffe schnell an den Innenwänden der Abfallbehälter fest, so dass diese nicht ordnungsgemäß geleert werden können. Die Müllwerker haben nicht die Möglichkeit, die festgefrorenen Abfälle vom Behälter zu lösen.

Um das Problem weitgehend einzuschränken, sollten feuchte Inhaltsstoffe im Winter immer ausreichend mit Zeitungspapier verpackt in die Abfalltonnen gegeben werden. Oft hilft auch etwas Speiseöl, das, am Innenrand des Abfallbehälters aufgeträufelt, ein Festfrieren verhindert. Ist es richtig knackig kalt, sollten die Mülltonnen geschützt stehen, etwa unter dem Carport oder in der Garage, und erst kurz vor der Leerung an die Straße gerollt werden.

Ich sende Ihnen einen Amtlichen Abfallsack zu, damit Sie darin bis zum nächsten regulären Leerungstermin Ihre Abfälle sammeln können. Der Sack wird dann mitgenommen.
Ich bitte Sie, die im Behälter verbliebenen Abfälle zur nächsten Leerung aufzulockern.`,
    },
    {
      id: "beschwerde-teilweise-geleert",
      title: "Beschwerde: Bio/Restabfall teilweise geleert",
      content: `Sie haben uns mitgeteilt, dass Ihr Abfallbehälter nicht vollständig geleert wurde. Dieses bedauere ich sehr, denn es ist uns grundsätzlich an einer ordnungsgemäßen Entsorgung der Abfälle gelegen.

Die Müllwerker hängen den Behälter in die Schüttung des Fahrzeugs. Der Kippvorgang selbst ist automatisiert, der Behälter wird angeschlagen und dann heruntergefahren. Während des Kippens zeichnet die Fahrzeugelektronik auf, welcher Behälter wann geleert wurde, es ist allerdings bei den Leerungsdaten nicht sichtbar, ob noch ein Rest Abfall im Behälter verblieben ist. Behälter, die bereits einmal gekippt wurden, können aus technischen Gründen nicht noch einmal angehoben werden. Für einen zweiten Schüttvorgang sind sie gesperrt.

Die Müllwerker haben keine Möglichkeit, nicht herausgefallene Abfälle nachträglich zu entsorgen. Ich sende Ihnen einen Amtlichen Abfallsack zu, damit Sie darin bis zum nächsten regulären Leerungstermin Ihre Abfälle sammeln können. Der Sack wird dann mitgenommen. Ich bitte Sie, die im Behälter verbliebenen Abfälle zur nächsten Leerung aufzulockern.`,
    },
  ],

  tonnenbereitstellung: [
    {
      id: "behaelteranmeldung",
      title: "Behälteranmeldung bestätigt",
      content: `Ihr Auftrag zur Behälterlieferung ist bei uns eingegangen und wird zu [DATUM] berücksichtigt.
Einen konkreten Auslieferungstermin kann ich Ihnen leider nicht mitteilen.

Eine Änderungsrechnung geht Ihnen in Kürze zu.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "behaelter-defekt",
      title: "Behälter defekt – Tausch beauftragt",
      content: `vielen Dank für Ihre Mitteilung.
Bitte unterstützen Sie unser Behälterteam, indem Sie den Behälter gut sichtbar und frei zugänglich auf dem Grundstück bereitstellen. Unsere Mitarbeiter kommen in den nächsten Wochen und tauschen den Behälter auch aus, wenn er befüllt sein sollte.
Bei Kleinreparaturen wird der Behälter vor Ort instand gesetzt.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
    {
      id: "anmeldung-neubau",
      title: "Anmeldung Neubau bestätigt",
      content: `vielen Dank für die Anmeldung Ihres Neubaus an die Abfallentsorgung. Ihr Auftrag zur Behälterlieferung ist bei uns eingegangen und wird zum gewünschten Termin berücksichtigt. Einen konkreten Auslieferungstermin kann ich Ihnen leider nicht mitteilen.

Für die Auslieferung von Behältern ist es für unser Behälterteam sehr hilfreich, wenn eine Hausnummer vorhanden ist. Alternativ kleben Sie bitte z. B. einen Zettel mit der Hausnummer gut sichtbar an Fenster oder Haustür.

Für Neubaugebiete gilt: Bitte beachten, dass die Entsorgungsfahrzeuge nur Straßen befahren, die von der Kommune gewidmet wurden, d. h., für den öffentlichen Verkehr überlassen worden sind. Sollte die Straße noch nicht befahrbar sein (Baustraße), stellen Sie bitte Abfallbehälter und ggf. Sperrmüll zu Ihrem Abfuhrtermin an die nächste befestigte Straße, wenn kein Sammelplatz eingerichtet wurde.

Sie erhalten demnächst die Jahresrechnung zur Abfallentsorgung sowie ein SEPA-Lastschriftmandat.

Melden Sie sich gerne mit Ihrer Kundennummer auf unserem Kundenportal auf portal.awsh.de an. Sie erhalten dann alle Belege online und können Abholtermine für Sperrmüll und Elektroschrott buchen oder die Bankverbindung ändern. Der digitale Rechnungsversand schont zudem die Ressourcen.`,
    },
  ],

  allgemein: [
    {
      id: "kalender-anfrage",
      title: "Abfuhrkalender – Anfrage",
      content: `hier ist der Link für die Abfuhrtermine/den Kalender:

https://www.awsh.de/service/abfuhrtermine/

Nach Eingabe der Adressdaten haken Sie bitte unter „Diese Abfallbehälter anzeigen" die Behälter an, die für das Grundstück angemeldet sind.
Auf das blaue Feld „Nächste Termine anzeigen" klicken.

Unter "Abfuhrkalender anzeigen" kann der gewünschte Zeitraum angeklickt werden. Der Kalender erscheint. Bitte auf das Feld „Als PDF öffnen" und im nächsten Schritt dann ausdrucken.

Sie können sich ebenfalls über unsere App "AWSH-Wertvolle Termine" auf Ihrem Smartphone an alle Termine erinnern lassen.`,
    },
    {
      id: "biotonne-tipps",
      title: "Biotonne – Tipps zum Umgang",
      content: `- Rasen- und Strauchschnitt getrocknet in die Biotonne füllen
- Auf den Boden der Biotonne eine Lage Eierkartons oder zerknülltes Zeitungspapier legen
- Feuchte Küchenabfälle oder Essensreste stets in Zeitungspapier einschlagen oder in Papiertüten füllen
- Den Inhalt der Biotonne nicht verdichten
- Den Behälter im Sommer nicht in die pralle Sonne stellen, im Winter möglichst an einen windgeschützten Platz oder in die Garage stellen
- Im Sommer die Biotonne gelegentlich mit Wasser ausspritzen
- Ein essiggetränkter Lappen oder dosierte Mengen an Kalk oder Gesteinsmehl wirken gegen Maden
- Festgefrorenen Inhalt vor der Leerung mit einem Spaten vom Tonnenrand lösen

Bitte beachten Sie: Plastik und kompostierbare Plastiktüten gehören nicht in die Biotonne.`,
    },
  ],
};

export function getTemplatesForCategory(category: string): Textbaustein[] {
  return TEXTBAUSTEINE_BY_CATEGORY[category] ?? [];
}

export function getAllTemplates(): Textbaustein[] {
  return Object.values(TEXTBAUSTEINE_BY_CATEGORY).flat();
}

export function getTemplateById(id: string): Textbaustein | undefined {
  return getAllTemplates().find((t) => t.id === id);
}
