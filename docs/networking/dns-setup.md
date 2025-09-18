# Local Subdomain Setup with Docker, Go, Nginx & MySQL

This guide explains how to run your Go app with multiple local subdomains using Docker and Nginx, without changing system-wide DNS settings. Works on **Windows, macOS, and Linux** with only **one hosts file entry**.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Hosts File Setup](#step-1-hosts-file-setup)
- [Step 2: Docker Compose Setup](#step-2-docker-compose-setup)
- [Step 3: Nginx Configuration](#step-3-nginx-configuration)
- [Step 4: Running the Setup](#step-4-running-the-setup)
- [Step 5: Accessing the App](#step-5-accessing-the-app)
- [FAQ](#faq)

---

## Overview

We will:

1. Run a Go backend in Docker.
2. Use MySQL in Docker for persistence.
3. Use Nginx as a reverse proxy to route **all subdomains** (`*.kislap.test`) to the Go app.
4. Only need **one line in the hosts file** for local DNS resolution.

This avoids touching system-wide DNS or installing `dnsmasq`.

---

## Prerequisites

- Docker & Docker Compose installed.
- Go project ready with `main.go`.
- `air` configured for live reload (optional).

---

## Step 1: Hosts File Setup

Add one line to your hosts file so your system resolves `kislap.test` to `localhost`.

### Windows

1. Open `Notepad` as Administrator.
2. Open the file:
3. Add:
4. Save and flush DNS cache:

```cmd
ipconfig /flushdns

### macOS
sudo nano /etc/hosts
127.0.0.1 kislap.test
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

### Linux
sudo nano /etc/hosts
127.0.0.1 kislap.test
sudo systemctl restart systemd-resolved
```
