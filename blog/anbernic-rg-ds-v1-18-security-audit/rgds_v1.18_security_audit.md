So I bought an [ANBERNIC RG DS](https://anbernic.com/products/rgds) without an SD card because the included cards have a pretty rough reputation, flashed ANBERNIC's official Android 14 V1.18 firmware, and then had the completely reasonable cybersecurity-person thought:

```text
What exactly did I just put on my network?
```

I did not want to call the firmware malicious just because it came from a cheap Android handheld, but I also was not going to blindly trust it. So I pulled the device apart from the software side: installed packages, privileged services, Android security settings, persistence mechanisms, and its first connection to Wi-Fi.

The short version is kind of weird.

I found **no evidence that the firmware is actively malicious**.

I also found that it is **hilariously poorly hardened** and should absolutely not be treated like a normal trusted Android device.

📄 [Download the raw audit notes](/blog/anbernic-rg-ds-v1-18-security-audit/rgds_v1.18_security_audit.md)

---

## What I Tested

I focused the audit on a few questions:

- What APKs and privileged vendor services are installed?
- Does anything look like obvious malware or a persistence mechanism?
- Where does the device talk when it first gets internet access?
- Is ADB exposed over the network?
- Are there hidden proxies, VPNs, certificates, or accessibility services?
- Does Android's application sandbox actually mean anything on this build?

For static inspection, I pulled all **116 installed APKs** over ADB, hashed them, and scanned them with ESET.

```text
APKs collected: 116
ESET detections: 0
```

I also checked for the usual remote-access and post-exploitation tools I would not expect on a stock gaming handheld: SSH, Telnet, Frida Server, and `gdbserver`.

None of them were present.

That does not mathematically prove every byte of the firmware is clean, but it gave me no static evidence of an obvious payload hiding in the installed applications.

---

## Capturing Its First Network Connection

The network side was the part I was most curious about.

I captured the device's first Wi-Fi session and ended up with roughly:

```text
160 MB
136,000 packets
```

At first glance, some of the larger transfers looked a little ugly. The biggest flows involved `12.12.50.x` and `12.6.203.x` addresses, which is exactly the kind of thing that looks suspicious when all you have is a packet list and no context.

DNS gave the context.

Those addresses resolved to Google `gvt1.com` content-delivery hosts, and the large transfers were inbound Google Play and Android content rather than the handheld dumping data somewhere unexplained.

The domains I observed included:

- `android.googleapis.com`
- `play.googleapis.com`
- `play-fe.googleapis.com`
- `firebaseinstallations.googleapis.com`
- `connectivitycheck.gstatic.com`
- `time.android.com`
- `mtalk.google.com`
- `*.gvt1.com`

I did **not** observe unexplained Chinese telemetry domains, suspicious command-and-control traffic, unusual listening ports, or a network-accessible ADB service.

The only plaintext HTTP request I saw was:

```http
GET http://www.google.cn/generate_204
```

That was consistent with Android's captive-portal/connectivity check. Weird-looking at first, but not evidence of the device phoning home to ANBERNIC.

---

## Then the Actual Problem Showed Up

The biggest finding was not malware.

It was the firmware's security configuration.

V1.18 is a **userdebug engineering build** with:

- SELinux running **Permissive**
- `ro.secure=0`
- `ro.debuggable=1`
- an unlocked/orange verified-boot state
- root ADB over USB with no host authorization
- `/system/bin/su` installed with mode `6777`

That is a pretty spectacular collection of settings for a consumer device.

Android normally relies on application UIDs, SELinux policy, verified boot, and ADB authorization to keep one bad application from owning the entire system. This firmware weakens essentially every layer in that chain.

The existence of `su` by itself was not enough for me, so I tested whether an ordinary application context could actually use it.

I launched it from a genuine Android `untrusted_app` SELinux context and ordinary application UID. The process successfully became:

```text
uid=0(root)
```

So this was not just a scary property string or a theoretical configuration problem. A malicious APK capable of executing the shipped `su` binary could effectively compromise the entire device.

That was the real security finding.

---

## What I Removed

After documenting the stock state, I removed or disabled the privileged vendor software I did not need, including:

- the Rockchip OTA update service
- the YLM setup wizard
- the YLM launcher
- factory and test utilities
- ANBERNIC's AI software
- the unused YLM key-mapping application
- third-party applications and emulators I was not going to use

I kept the RG-specific settings application because testing showed that the device actually uses it for hardware functionality. Debloating is easy; removing something important and discovering three days later that a button no longer works is also easy. (￣▽￣*)ゞ

I also confirmed there was:

- no active ADB listener on TCP/5555
- no hidden global HTTP proxy
- no forced Private DNS provider
- no always-on VPN
- no user-added CA certificates
- no enabled Accessibility Services
- no enabled notification listeners
- no Device Owner or Profile Owner
- no suspicious privileged background process left running

---

## So... Is the RG DS Malware?

Based on everything I tested, **I found no evidence that the official V1.18 firmware is actively malicious**.

That wording matters. I cannot prove a negative or claim that every possible execution path in the firmware was exhaustively audited. What I can say is that static APK inspection, process and configuration review, and a fairly large first-network capture did not show malware, unexplained telemetry, or remote-access behavior.

The more honest conclusion is:

| Area | Assessment |
| --- | --- |
| Malware evidence | None observed |
| Network behavior | Normal during testing |
| Firmware hardening | Poor |
| Application sandbox integrity | Weak |
| Recommended use | Dedicated gaming device only |

I am comfortable using it as a gaming handheld.

I am **not** comfortable treating it as a trusted general-purpose Android device.

For my use, that means:

- tightly controlling which APKs get installed
- disabling USB debugging when I do not need it
- connecting it only to computers I trust
- keeping banking, password-manager, and other sensitive accounts off it
- treating the entire thing like a game console, not a phone or tablet

That distinction is really the whole audit.

The RG DS does not appear to be secretly attacking my network. It is just running an engineering build whose security model falls apart the moment a malicious application lands on it.
