import socket

for host in ("tabledetective.com", "www.tabledetective.com"):
    try:
        infos = socket.getaddrinfo(host, 443)
        addrs = sorted({i[4][0] for i in infos})
        print(f"{host} -> {', '.join(addrs)}")
    except Exception as exc:
        print(f"{host} -> FAIL {type(exc).__name__}: {exc}")
