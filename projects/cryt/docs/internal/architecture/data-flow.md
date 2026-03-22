# Data Flow

## Message Pipeline

```mermaid
graph TD
    User[User Input] --> Enc[Encoding Layer (Morse/Cipher)]
    Enc --> Crypt[Encryption Layer (Optional)]
    Crypt --> Trans[Cloudflare Realtime DataChannel]
    Trans --> Peer[Peer]
    Peer --> Decrypt[Decrypt]
    Decrypt --> Decode[Decode]
    Decode --> Display[Display]
```

1.  **User Input**: User types a message.
2.  **Encoding**: Message is transformed into dots/dashes or cipher text.
3.  **Encryption**: (Optional) Encoded message is encrypted using AES-GCM.
4.  **Transport**: Sent via WebRTC DataChannels through Cloudflare.
5.  **Peer**: Message received by other participants.
6.  **Decrypt**: (If encrypted) Message is decrypted.
7.  **Decode**: Message is decoded back to text for display (or kept as dots/dashes).
8.  **Display**: Rendered in the UI.
