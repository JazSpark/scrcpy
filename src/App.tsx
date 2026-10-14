import { useState } from 'react';

function App() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const scripts = [
    {
      title: "Script 1: Pantalla apagada + Sin ventana CMD (Recomendado)",
      description: "Este archivo VBS ejecuta scrcpy con la pantalla del celular apagada y sin mostrar ninguna ventana de comandos.",
      filename: "scrcpy-silent.vbs",
      code: `CreateObject("WScript.Shell").Run "cmd /c scrcpy --turn-screen-off --stay-awake", 0, False`,
      explanation: `• --turn-screen-off (-S): Apaga la pantalla del celular al iniciar\n• --stay-awake (-w): Mantiene el dispositivo despierto aunque la pantalla esté apagada\n• El segundo parámetro "0" en .Run oculta la ventana completamente`
    },
    {
      title: "Script 2: Versión con opciones adicionales",
      description: "Versión mejorada con más control sobre la transmisión.",
      filename: "scrcpy-full.vbs",
      code: `Set WshShell = CreateObject("WScript.Shell")\nWshShell.Run "cmd /c scrcpy --turn-screen-off --stay-awake --max-fps=60 --no-audio", 0, False\nSet WshShell = Nothing`,
      explanation: `• --max-fps=60: Limita los FPS para mejor rendimiento\n• --no-audio: Desactiva la transmisión de audio (opcional, quítalo si quieres audio)\n• Set WshShell = Nothing: Libera el objeto de memoria`
    },
    {
      title: "Script 3: BAT + VBS combinado (Máxima compatibilidad)",
      description: "Crea un archivo .bat que luego es ejecutado silenciosamente por un .vbs. Útil si necesitas más comandos.",
      filename: "scrcpy-start.bat",
      code: `@echo off\nscrcpy --turn-screen-off --stay-awake\nexit`,
      explanation: `Este archivo BAT debe ir acompañado de un VBS:\n\nCreateObject("WScript.Shell").Run "scrcpy-start.bat", 0, False\n\nEl VBS ejecuta el BAT sin mostrar ventana.`
    },
    {
      title: "Script 4: Solo apagar pantalla (con ventana CMD visible)",
      description: "Si solo quieres apagar la pantalla pero no te importa la ventana de CMD.",
      filename: "scrcpy-screen-off.bat",
      code: `@echo off\nscrcpy --turn-screen-off --stay-awake`,
      explanation: `Este es el comando más simple. Solo apaga la pantalla del celular y mantiene el dispositivo despierto.\n\nTambién puedes ejecutar directamente desde CMD:\nscrcpy -S -w`
    },
    {
      title: "Script 5: Apagar pantalla DESPUÉS de iniciar scrcpy",
      description: "Si prefieres iniciar scrcpy normalmente y luego apagar la pantalla con ADB.",
      filename: "scrcpy-then-off.bat",
      code: `@echo off\nstart scrcpy\ntimeout /t 3 /nobreak >nul\nadb shell input keyevent 26`,
      explanation: `• start scrcpy: Inicia scrcpy normalmente\n• timeout /t 3: Espera 3 segundos a que scrcpy se conecte\n• adb shell input keyevent 26: Simula presionar el botón de encendido (apaga la pantalla)\n\nNota: La pantalla se apagará pero scrcpy seguirá funcionando.`
    }
  ];

  const vbsCompanion = `CreateObject("WScript.Shell").Run "scrcpy-start.bat", 0, False`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <i className="fas fa-mobile-screen text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold">Guía scrcpy para Windows</h1>
            <p className="text-sm text-gray-400">Pantalla apagada + Sin ventana CMD</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border border-emerald-700/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-400"></i>
              ¿Qué vamos a lograr?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📱</span>
                  <h3 className="font-semibold text-emerald-400">1. Pantalla apagada</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  La pantalla de tu celular estará completamente apagada (ahorrando batería), 
                  pero seguirás viendo y controlando tu celular desde la PC sin problemas.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🖥️</span>
                  <h3 className="font-semibold text-emerald-400">2. Sin ventana negra</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  La ventana de CMD (la ventana negra de comandos) no aparecerá. 
                  scrcpy se ejecutará completamente en segundo plano, solo verás la ventana de tu celular.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-clipboard-check text-blue-400"></i>
            Requisitos previos
          </h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <span><strong>scrcpy instalado</strong> — Descargado desde <a href="https://github.com/Genymobile/scrcpy" target="_blank" rel="noopener" className="text-blue-400 hover:underline">github.com/Genymobile/scrcpy</a></span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <span><strong>Depuración USB activada</strong> — En Opciones de desarrollador de tu celular</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <span><strong>Celular conectado por USB</strong> — Con cable de datos (no solo carga)</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-400 mt-1"></i>
                <span><strong>ADB en el PATH</strong> — O tener scrcpy en una carpeta con adb incluido</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Scripts */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-code text-purple-400"></i>
            Scripts listos para usar
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Haz clic en el botón "Copiar" de cada script y guárdalo con el nombre indicado. 
            Los archivos .vbs se ejecutan con doble clic.
          </p>

          <div className="space-y-6">
            {scripts.map((script, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-700/30">
                  <h3 className="font-bold text-lg text-white mb-1">{script.title}</h3>
                  <p className="text-gray-400 text-sm">{script.description}</p>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                      📄 {script.filename}
                    </span>
                    <button
                      onClick={() => copyToClipboard(script.code, index)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        copiedIndex === index
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <i className={`fas ${copiedIndex === index ? 'fa-check' : 'fa-copy'}`}></i>
                      {copiedIndex === index ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-700/50 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-green-300 font-mono whitespace-pre">{script.code}</code>
                  </pre>
                  
                  <div className="mt-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Explicación:</p>
                    <p className="text-sm text-gray-300 whitespace-pre-line">{script.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Companion VBS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-puzzle-piece text-orange-400"></i>
            VBS acompañante (para Script 3)
          </h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-3">
              Si usaste el Script 3 (el .bat), necesitas este archivo .vbs en la misma carpeta para ejecutarlo sin ventana:
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                📄 scrcpy-run.vbs
              </span>
              <button
                onClick={() => copyToClipboard(vbsCompanion, 99)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  copiedIndex === 99
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <i className={`fas ${copiedIndex === 99 ? 'fa-check' : 'fa-copy'}`}></i>
                {copiedIndex === 99 ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="bg-gray-900 border border-gray-700/50 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-green-300 font-mono whitespace-pre">{vbsCompanion}</code>
            </pre>
          </div>
        </section>

        {/* Quick start */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-rocket text-yellow-400"></i>
            Pasos rápidos (método recomendado)
          </h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium">Abre el Bloc de notas</p>
                  <p className="text-sm text-gray-400">Presiona Win + R, escribe <code className="bg-gray-700 px-1 rounded text-xs">notepad</code> y presiona Enter</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium">Copia el Script 1</p>
                  <p className="text-sm text-gray-400">Haz clic en "Copiar" del Script 1 (el recomendado) y pégalo en el Bloc de notas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium">Guarda como .vbs</p>
                  <p className="text-sm text-gray-400">
                    Archivo → Guardar como → Tipo: "Todos los archivos" → Nombre: <code className="bg-gray-700 px-1 rounded text-xs">scrcpy-silent.vbs</code>
                    <br />Guárdalo en la misma carpeta donde está scrcpy.exe
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium">Conecta tu celular y ejecuta</p>
                  <p className="text-sm text-gray-400">
                    Conecta tu celular por USB, asegúrate de que la depuración USB esté activa, 
                    y haz doble clic en <code className="bg-gray-700 px-1 rounded text-xs">scrcpy-silent.vbs</code>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <p className="font-medium">¡Listo! 🎉</p>
                  <p className="text-sm text-gray-400">
                    La ventana de tu celular aparecerá en tu PC, la pantalla del celular se apagará, 
                    y no habrá ninguna ventana negra de CMD.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-wrench text-red-400"></i>
            Solución de problemas
          </h2>
          <div className="space-y-4">
            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ "scrcpy no se reconoce como comando"</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2">Necesitas agregar scrcpy al PATH de Windows o ejecutar el script desde la carpeta de scrcpy.</p>
                <p><strong>Solución rápida:</strong> Guarda el archivo .vbs dentro de la carpeta donde está scrcpy.exe, o modifica el script para incluir la ruta completa:</p>
                <code className="block bg-gray-900 p-2 rounded mt-2 text-green-300 text-xs">
                  CreateObject("WScript.Shell").Run "cmd /c C:\ruta\a\scrcpy\scrcpy.exe --turn-screen-off", 0, False
                </code>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ La pantalla no se apaga</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2">Algunos celulares no soportan apagar la pantalla por software. Prueba:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Usar el Script 5 que apaga la pantalla con el botón de encendido simulado</li>
                  <li>Verificar que tu versión de scrcpy sea reciente (2.x+)</li>
                  <li>Algunos fabricantes (Samsung, Xiaomi) pueden bloquear esta función</li>
                </ul>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ "device not found" o no detecta el celular</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <ul className="list-disc list-inside space-y-1">
                  <li>Verifica que la depuración USB esté activada en tu celular</li>
                  <li>Acepta el permiso de depuración que aparece en la pantalla del celular</li>
                  <li>Prueba otro cable USB (algunos solo cargan, no transmiten datos)</li>
                  <li>Ejecuta <code className="bg-gray-900 px-1 rounded">adb devices</code> para verificar que se detecta</li>
                  <li>Instala los drivers USB de tu fabricante si es necesario</li>
                </ul>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ La ventana CMD sigue apareciendo</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2">Asegúrate de que:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Estés ejecutando el archivo .vbs (NO el .bat directamente)</li>
                  <li>El archivo .vbs tenga la extensión correcta (no .vbs.txt)</li>
                  <li>En el explorador de archivos, activa "Extensiones de nombre de archivo" en Vista → Mostrar</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Extra tips */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-star text-yellow-400"></i>
            Tips adicionales
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">🔋 Ahorro de batería</h4>
              <p className="text-sm text-gray-300">
                Con la pantalla apagada, tu celular consume mucha menos batería. 
                Combinado con <code className="bg-gray-700 px-1 rounded text-xs">--stay-awake</code>, 
                el celular no se dormirá pero la pantalla estará apagada.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">📶 Sin cable (WiFi)</h4>
              <p className="text-sm text-gray-300">
                También puedes usar scrcpy por WiFi. Primero conecta por USB y ejecuta:
                <code className="block bg-gray-900 p-2 rounded mt-2 text-green-300 text-xs">
                  adb tcpip 5555<br/>
                  adb connect IP_DEL_CELULAR:5555<br/>
                  scrcpy --turn-screen-off
                </code>
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">⌨️ Acceso directo</h4>
              <p className="text-sm text-gray-300">
                Puedes crear un acceso directo del archivo .vbs en tu escritorio para iniciar scrcpy 
                con un solo clic. Click derecho → Crear acceso directo.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">🎮 Control de juegos</h4>
              <p className="text-sm text-gray-300">
                Usa <code className="bg-gray-700 px-1 rounded text-xs">--turn-screen-off</code> para jugar 
                desde la PC con la pantalla del celular apagada. 
                Combínalo con <code className="bg-gray-700 px-1 rounded text-xs">--gamepad</code> si tienes control.
              </p>
            </div>
          </div>
        </section>

        {/* Command reference */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-terminal text-cyan-400"></i>
            Referencia de comandos útiles
          </h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-900/50">
                  <th className="text-left p-3 text-gray-400 font-medium">Comando</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--turn-screen-off, -S</code></td>
                  <td className="p-3 text-gray-300">Apaga la pantalla del dispositivo al iniciar</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--stay-awake, -w</code></td>
                  <td className="p-3 text-gray-300">Mantiene el dispositivo despierto (no se bloquea)</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--max-fps=valor</code></td>
                  <td className="p-3 text-gray-300">Limita los FPS de la transmisión</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--max-size=valor</code></td>
                  <td className="p-3 text-gray-300">Limita la resolución (ej: 1024)</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--bit-rate=valor</code></td>
                  <td className="p-3 text-gray-300">Bitrate de la transmisión (ej: 2M)</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--no-audio</code></td>
                  <td className="p-3 text-gray-300">No transmite audio</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--record=archivo.mp4</code></td>
                  <td className="p-3 text-gray-300">Graba la pantalla en un archivo</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--always-on-top</code></td>
                  <td className="p-3 text-gray-300">La ventana de scrcpy siempre está encima</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--fullscreen, -f</code></td>
                  <td className="p-3 text-gray-300">Inicia en pantalla completa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-6 text-center text-gray-500 text-sm">
        <p>Guía creada para scrcpy en Windows • Basado en <a href="https://github.com/Genymobile/scrcpy" target="_blank" rel="noopener" className="text-blue-400 hover:underline">scrcpy</a> de Genymobile</p>
      </footer>
    </div>
  );
}

export default App;
