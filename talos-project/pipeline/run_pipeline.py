import sys
import time
import subprocess

def run_step(step_name, script_name):
    print(f"\n==================================================")
    print(f"[+] Iniciando {step_name} ({script_name})")
    print(f"==================================================")
    result = subprocess.run([sys.executable, script_name])
    if result.returncode != 0:
        print(f"[-] Error en {step_name}. Código de salida: {result.returncode}")
        sys.exit(result.returncode)

def main():
    start_time = time.time()
    print("[+] Orquestador Talos: Iniciando pipeline completo...")
    
    run_step("Etapa 1: Scraping", "main_scraper.py")
    run_step("Etapa 2: Clustering", "main_clustering.py")
    run_step("Etapa 3: Análisis NLP", "main_nlp.py")
    
    elapsed_time = time.time() - start_time
    print("\n==================================================")
    print("[✓] Pipeline ejecutado correctamente.")
    print(f"[RNF-04] Tiempo total de ejecución: {elapsed_time:.2f} segundos")
    print("==================================================")

if __name__ == "__main__":
    main()
