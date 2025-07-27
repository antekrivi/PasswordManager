# 🔐 Password Manager

Ova aplikacija je siguran **password manager** razvijen pomoću **Angulara** (frontend) i **Node.js/Expressa** (backend), uz pohranu podataka u **MongoDB**. Korisnici se registriraju i prijavljuju pomoću **master lozinke**, a dodatno osiguranje pruža podrška za **TOTP-based dvofaktorsku autentifikaciju (2FA)**. Vault se otključava pomoću lozinke, a korisnici mogu dodavati, uređivati i brisati zapise (naslov, lozinka, email, napomena).

Lozinke se **enkriptiraju i dekriptiraju na backendu**, a pristup aplikaciji zaštićen je **JWT autentifikacijom putem HttpOnly cookieja**. Sučelje koristi **Reactive Forms** i nudi jednostavno, validirano korisničko iskustvo.

---

## ✅ Feature-i

- Registracija i prijava s master lozinkom
- JWT autentifikacija (HttpOnly cookies)
- HTTPS podrška (lokalno s mkcert)
- TOTP-based 2FA (kompatibilno s aplikacijama poput Google/Microsoft Authenticator)
- Vault s:
  - Dodavanjem zapisa (naslov, email, lozinka, napomena)
  - Uređivanjem i brisanjem zapisa
- Zaštita brute-force napada: zaključavanje računa nakon višestrukih neuspjelih prijava
- Validacija unosa putem Reactive Forms (Angular)

---

## 🧪 Tehnologije

- **Frontend:** Angular, RxJS, Angular Reactive Forms
- **Backend:** Node.js, Express, TypeScript
- **Baza:** MongoDB
- **Sigurnost:** JWT, HTTPS, AES enkripcija, Argon2id, HttpOnly cookies

---

## 🚀 Pokretanje aplikacije

### 🔧 Backend

```bash
cd backend
npm install
npm run dev
```

Primjer `.env` datoteke:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/passwordmanager
JWT_SECRET=supersecret
JWT_ACCESS_SECRET=xxxxxxxxxxxxx
JWT_REFRESH_SECRET=yyyyyyyyyyyy
MAIL_USER=example@gmail.com
MAIL_PASS=abcd efgh ijkl mnop
```

### 🖥️ Frontend

```bash
cd frontend
npm install
ng serve --ssl true
```

---

## 🔐 Sigurnost Vault zapisa

Svi korisnički zapisi unutar vaulta kriptografski su zaštićeni kroz više razina sigurnosti:

- **Master lozinka** se nikada ne pohranjuje direktno – koristi se **Argon2id hash** s jedinstvenim `salt`-om (`encryptionSalt`) po korisniku.
- Vault zapisi se **kriptiraju na backendu**, koristeći ključ deriviran iz master lozinke i istog `salt`-a.
- Svaki zapis ima pridruženi **HMAC (**``**)** kako bi se osigurala autentičnost i integritet zapisa.
- **Password hint** se pohranjuje čitljivo (opcionalno) radi lakšeg prisjećanja, no ne kompromitira sigurnost.
- Broj neuspjelih pokušaja prijave se bilježi – nakon određenog broja pokušaja račun se **zaključava** pomoću `isLocked`, `failedLoginAttempts` i `lockUntil` polja.

Primjer korisničkog zapisa:

```json
{
  "_id": "6873bd4294ce963a4be044db",
  "email": "ante@gmail.com",
  "passwordHash": "$argon2id$...",
  "passwordHint": "ante1234",
  "encryptionSalt": "Do+dGvDr0s46tEgAxKI0Ug==",
  "vaultHmac": "8c2163f4008593710c1be24d6d32daa6ec027ee8f2f7fa5762b5547547c4ec26",
  "isLocked": false,
  "failedLoginAttempts": 0,
  "lockUntil": "2025-07-27T15:47:29.118+00:00"
}
```

👉 Čak i ako baza podataka bude kompromitirana, napadač ne može dešifrirati zapise bez ispravne master lozinke korisnika.

---

