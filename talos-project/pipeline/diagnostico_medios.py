from collector import load_sources, get_article_urls

for s in load_sources("sources.json"):
    try:
        urls = get_article_urls(s)
        print(f"{s['id']:>3} {s['nombre']:<20} {s['sesgo']:<7} {len(urls):>3} URL encontradas")
    except Exception as e:
        print(f"{s['id']:>3} {s['nombre']:<20} ERROR: {e}")
