## Kurz zum Setup

Für diese Übungsaufgabe kannst du von Development aus ein neues Branch erstellen.

Im GUI dann `cd client && npm ci && npx playwright install`.

Das Backend läuft mit Profil **e2e** (evtl musst du das noch hinzufügen: -Dspring.profiles.active=prod,ws,dev,**e2e**,swagger ).
Wenn du das Backend dann neu startest, sollten die Flyway Scripts unter src/main/resources/config/sql/e2e laufen und dir ein paar Daten im Backend hinzufügen.

Eingeloggt wird dann als `testmain` / `testmain`.

## Was meine Idee war

**Erstens ein Login-Test.**
Seite auf, Daten rein, einloggen, schauen ob man drin ist. Ganz stumpf. Diesen wird man dann immer wieder brauchen, da man sich dann zukünftig für jeden weiteren Test sich ja zuert einloggen muss.

**Zweitens ein Test, der einen Benutzer anlegt.** Einloggen, auf `/user-account/create`, Formular
ausfüllen, speichern und dann prüfen, dass der Benutzer auch wirklich da ist. Das ist der Teil,
der zählt. Dass das Formular abgeschickt wurde, heisst ja noch nicht, dass hinten was ankam. Also
lieber in der Liste suchen oder die Seite neu laden und nachschauen.

Beim Benutzernamen: muss eindeutig sein, sonst kollidiert er mit den Flyway-Daten (username darf nicht duplicate in DB sein).

Also ein Tipp für diese Tests, Playwright soll eigentlich genau das Gleiche machen wie ein Mensch, aber automatisch. Also wenn du unsicher bist, was ein Test machen soll, zb. Create user Account, dann
probier selber von Hand ein Account zu erstellen und schreibe dir die Schritte auf, zb.:

1. localhost:8082 öffnen
2. Username Feld anclicken
3. Username eingeben
4. Password Feld anclicken
5. usw usw.

Das Gleiche muss Playwright dann machen, einfach im Code.

## Selektoren

Unsere Komponenten haben `data-testid`,
genau dafür. In Playwright ist das `page.getByTestId(...)`. Schau einfach mal mit den Dev-Tools in
die Login-Seite rein, dann siehst du die IDs (einfach in HTML im Chrome oder Firefox, du solltest data-testId überall finden).

Die Feldnamen vom Benutzerformular stehen in
`src/pages/(app)/user-account/userAccountFormConfig.ts`. Die Test-IDs bauen sich daraus zusammen,
nach welchem Muster kriegst du schnell raus.

`npx playwright codegen http://localhost:8082` (findest die gleiche Command im package.json) ist zum Reinkommen ganz nett, da klickst du dich
durch und er schreibt mit. Was rauskommt ist aber eher ein Entwurf als fertiger Code.

## Ausführen

Eigene Config, weil die bestehende `playwright.config.ts` auf `tests/e2e` zeigt und unseren Ordner
gar nicht sieht:

npx playwright test -c playwright.full-e2e.config.ts --headed oder dann einfach das play button in der IDE benutzen

`--headed` zeigt den Browser, `--debug` hält bei jedem Schritt an, `-g "irgendwas"` filtert auf
einen einzelnen Test.

Falls dir `npm run typecheck:playwright` um die Ohren fliegt: das ist auf `development` gerade
schon kaputt, `ImportMeta.hot` im Router. Nicht deine Schuld, nicht suchen. Wird separat gefixt.

## Und danach, falls die 2 Tests oben zu wenig sind

Wenn beides grün ist, schau dir mal `client/tests/e2e` an. Da steht einiges von dem schon drin, was
du gerade von Hand geschrieben hast. Die Idee ist, dass es zu jeder wiederverwendbaren
Vue-Komponente ein passendes Test-Modell gibt. Interessant sind für dich vor allem:

- `shared/page-models/layout/login-page.model.ts`
- `utils/authenticate.ts`
- `shared/page-models/model-pages/form-page.model.ts`
- `shared/page-models/widgets/form-field.model.ts`

Bau deine zwei Tests dann so um, dass sie das benutzen. Am Ende sollte im Test stehen, _was_
getestet wird, und nicht, wie man auf einen Button klickt.

Ein Punkt dabei ist mir wichtig: der Ordner `tests/e2e` arbeitet gegen ein gemocktes Backend. Wir
übernehmen die Seiten-Modelle, aber nicht das Mocking. Also kein `page.route` und kein
`installMockBackend` bei den full-e2e drin, sonst testen wir am Ende wieder nur ein gemocktes be.

Und wenn dir auffällt, dass eines der Modelle etwas nicht kann was du brauchst, kannst du auch erweitern.

Und ja, wenn Fragen aufpoppen. Gerne nachfragen. Dieses Weekend bin ich evtl relativ schwer erreichbar aber ich hoffe das es nach dieser Woche sich etwas beruhigt.
