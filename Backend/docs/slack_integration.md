# Integrasi Slack API dengan EventNow

Dokumen ini menjelaskan cara mengintegrasikan Slack API dengan aplikasi EventNow untuk mengirim notifikasi real-time tentang event dan registrasi.

## Fitur yang Diimplementasikan

1. **Notifikasi Event Baru**
   - Mengirim notifikasi ke channel Slack saat event baru dibuat
   - Format pesan menggunakan Slack Block Kit untuk tampilan yang menarik

2. **Notifikasi Registrasi Event**
   - Mengirim notifikasi ke channel Slack saat pengguna mendaftar ke event
   - Menampilkan informasi tentang event dan pengguna yang mendaftar

3. **Slack Events API**
   - Menerima dan memproses event dari Slack
   - Mendukung URL verification challenge

4. **Slack Slash Commands**
   - Mendukung command `/events` untuk melihat daftar event yang akan datang

## Konfigurasi

### Persyaratan

- Slack App yang sudah dibuat di [Slack API Dashboard](https://api.slack.com/apps)
- Bot token dengan izin yang sesuai
- Signing secret untuk verifikasi permintaan

### Variabel Lingkungan

Tambahkan variabel berikut ke file `.env`:

```
# Slack API configuration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
```

## Cara Menggunakan

### Mengirim Notifikasi ke Slack

```python
from services.slack_service import send_slack_notification

# Kirim pesan sederhana
await send_slack_notification("#general", "Hello from EventNow!")

# Kirim pesan dengan Block Kit
blocks = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Hello from EventNow!*"
        }
    }
]
await send_slack_notification("#general", "Hello from EventNow!", blocks)
```

### Notifikasi Event Baru

Notifikasi event baru akan otomatis dikirim saat endpoint `POST /api/events/` dipanggil untuk membuat event baru.

### Notifikasi Registrasi Event

Notifikasi registrasi event akan otomatis dikirim saat endpoint `POST /api/registrations/` dipanggil untuk mendaftar ke event.

### Menerima Event dari Slack

Konfigurasikan URL webhook di Slack App Anda ke:

```
https://your-domain.com/api/slack/events
```

### Menggunakan Slash Commands

Konfigurasikan slash command `/events` di Slack App Anda ke:

```
https://your-domain.com/api/slack/commands/events
```

## Pengujian

### Menguji Notifikasi

1. Buat event baru melalui API atau UI
2. Periksa channel Slack yang dikonfigurasi untuk notifikasi

### Menguji Slash Commands

1. Ketik `/events list` di Slack
2. Anda akan melihat daftar event yang akan datang

## Troubleshooting

### Pesan Tidak Terkirim

- Periksa `SLACK_BOT_TOKEN` Anda
- Pastikan bot telah diundang ke channel yang Anda coba kirim pesan
- Periksa log untuk pesan error

### Verifikasi Gagal

- Pastikan `SLACK_SIGNING_SECRET` sudah benar
- Periksa apakah timestamp permintaan valid (tidak lebih dari 5 menit)

## Referensi

- [Slack API Documentation](https://api.slack.com/)
- [Slack Block Kit](https://api.slack.com/block-kit)
- [Slack Events API](https://api.slack.com/apis/events-api)
