def test_feed(client, datos):
    r = client.get("/events/feed")
    assert r.status_code == 200
    ev = r.json()[0]
    assert ev["n_medios"] == 2 and ev["bias"] == {"left": 0, "center": 50, "right": 50}


def test_detalle(client, datos):
    assert client.get(f"/events/{datos['evento']}").status_code == 200


def test_detalle_inexistente(client, datos):
    assert client.get("/events/00000000-0000-0000-0000-000000000000").status_code == 404


def test_estadisticas(client, datos):
    r = client.get("/stats/medios")
    assert r.status_code == 200 and len(r.json()) == 2


def test_reporte(client, datos):
    r = client.post("/reports", json={"noticia_id": datos["noticia"], "motivo": "Prueba"})
    assert r.status_code == 201


def test_login_correcto(client, datos):
    r = client.post("/admin/login", json={"email": "admin@talos.cl", "password": "clave-prueba"})
    assert r.status_code == 200 and "access_token" in r.json()


def test_login_incorrecto(client, datos):
    r = client.post("/admin/login", json={"email": "admin@talos.cl", "password": "x"})
    assert r.status_code == 401


def test_admin_sin_token(client, datos):
    assert client.get("/admin/reports").status_code == 401


def test_admin_con_token(client, datos):
    token = client.post("/admin/login", json={"email": "admin@talos.cl",
                                              "password": "clave-prueba"}).json()["access_token"]
    r = client.get("/admin/reports", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200


def test_inyeccion_en_parametros(client, datos):
    r = client.get("/events/feed", params={"categoria": "Política' OR '1'='1"})
    assert r.status_code == 200 and r.json() == []
    r = client.post("/admin/login", json={"email": "' OR 1=1 --", "password": "x"})
    assert r.status_code == 401


def test_paginacion(client, datos):
    r = client.get("/events/feed", params={"limite": 1, "pagina": 1})
    assert r.status_code == 200 and len(r.json()) <= 1
