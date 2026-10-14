import { useState } from 'react';

function App() {
  const [copied, setCopied] = useState(false);

  const script = `@echo off
cd /d "%~dp0"
echo CreateObject("WScript.Shell").Run "scrcpy --turn-screen-off --stay-awake",0,False>"%temp%\\_sc.vbs"
wscript "%temp%\\_sc.vbs"
del "%temp%\\_sc.vbs" 2>nul
exit`;

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-lg">
            📱
          </div>
          <div>
            <h1 className="text-lg font-bold">scrcpy — Solución definitiva</h1>
            <p className="text-xs text-gray-500">Pantalla apagada + CMD 100% oculto</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Solución */}
        <section>
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <span className="text-2xl">✅</span> Un solo archivo .bat — Copia y pega esto
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Este archivo hace todo automáticamente: genera un VBS temporal, lanza scrcpy con la pantalla apagada y la CMD completamente oculta, y se borra solo.
            </p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">📄 scrcpy-silent.bat</span>
              <button
                onClick={copy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  copied ? 'bg-green-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                {copied ? '¡Copiado!' : 'Copiar código'}
              </button>
            </div>

            <pre className="bg-gray-900 border border-gray-800 rounded-xl p-5 overflow-x-auto">
              <code className="text-green-300 font-mono text-sm leading-relaxed whitespace-pre">{script}</code>
            </pre>

            {/* Explicación línea por línea */}
            <div className="mt-5 space-y-2">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">¿Qué hace cada línea?</p>
              <div className="bg-gray-900/60 rounded-xl divide-y divide-gray-800">
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">@echo off</code>
                  <span className="text-sm text-gray-400">No muestra los comandos en pantalla</span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">cd /d "%~dp0"</code>
                  <span className="text-sm text-gray-400">Cambia a la carpeta donde está el .bat (donde también está scrcpy.exe)</span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">echo ... &gt; _sc.vbs</code>
                  <span className="text-sm text-gray-400">Crea un archivo VBS temporal que lanza scrcpy con ventana oculta (<code className="text-yellow-400">0</code> = ventana invisible)</span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">wscript _sc.vbs</code>
                  <span className="text-sm text-gray-400">Ejecuta el VBS — scrcpy se lanza sin ventana de CMD</span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">del _sc.vbs</code>
                  <span className="text-sm text-gray-400">Borra el VBS temporal (se auto-limpia)</span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <code className="text-emerald-400 font-mono text-xs whitespace-nowrap mt-0.5">exit</code>
                  <span className="text-sm text-gray-400">Cierra el BAT — <strong className="text-white">no queda nada en la barra de tareas</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pasos */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span> Pasos para crearlo
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <ol className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold">Activa las extensiones de archivo</p>
                  <p className="text-sm text-gray-400">
                    Abre el Explorador → arriba <strong>"Vista"</strong> → marca <strong>"Extensiones de nombre de archivo"</strong>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold">Abre el Bloc de notas</p>
                  <p className="text-sm text-gray-400">
                    <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">Win</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">R</kbd> → escribe <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">notepad</code> → Enter
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-semibold">Pega el código de arriba</p>
                  <p className="text-sm text-gray-400">
                    Haz clic en <strong>"Copiar código"</strong> y pégalo en el Bloc de notas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-semibold">Guardar como... (¡importante!)</p>
                  <p className="text-sm text-gray-400">
                    <strong>Archivo → Guardar como</strong>
                  </p>
                  <ul className="text-sm text-gray-400 mt-2 space-y-1 ml-1">
                    <li>• <strong>Guardar en:</strong> La carpeta donde está <code className="bg-gray-800 px-1 rounded text-xs">scrcpy.exe</code></li>
                    <li>• <strong>Nombre:</strong> <code className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400">scrcpy-silent.bat</code></li>
                    <li>• <strong className="text-red-400">Tipo:</strong> <span className="text-red-400 font-semibold">"Todos los archivos (*.*)"</span> ← ¡No lo olvides!</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <p className="font-semibold">Verifica el nombre</p>
                  <p className="text-sm text-gray-400">
                    En la carpeta debe verse como <code className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400">scrcpy-silent.bat</code>
                    <br />
                    <span className="text-red-400">NO</span> como <code className="bg-gray-800 px-1.5 py-0.5 rounded text-red-400">scrcpy-silent.bat.txt</code>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">6</span>
                <div>
                  <p className="font-semibold">¡Doble clic y listo!</p>
                  <p className="text-sm text-gray-400">
                    Conecta tu celular → doble clic en <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">scrcpy-silent.bat</code>
                    <br />
                    Se abre la ventana de scrcpy, la pantalla del celular se apaga, y <strong className="text-white">no hay CMD en la barra de tareas</strong>.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Resultado esperado */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Resultado esperado
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-sm font-semibold text-emerald-400">Pantalla apagada</p>
              <p className="text-xs text-gray-500 mt-1">El celular tiene la pantalla apagada</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🖥️</div>
              <p className="text-sm font-semibold text-emerald-400">scrcpy visible</p>
              <p className="text-xs text-gray-500 mt-1">Ves y controlas el celular en tu PC</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">👻</div>
              <p className="text-sm font-semibold text-emerald-400">Sin CMD</p>
              <p className="text-xs text-gray-500 mt-1">No hay ventana negra en la barra de tareas</p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🔧</span> Si algo no funciona
          </h2>
          <div className="space-y-3">
            <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-800/50 transition font-medium flex items-center justify-between text-sm">
                <span>❌ "scrcpy no se reconoce como comando"</span>
                <i className="fas fa-chevron-down text-gray-600 group-open:rotate-180 transition-transform text-xs"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
                <p className="mb-2">El .bat no encuentra scrcpy. Asegúrate de que <strong className="text-white">el .bat esté en la misma carpeta que scrcpy.exe</strong>.</p>
                <p>Si scrcpy está en otra carpeta, reemplaza la línea del VBS con la ruta completa:</p>
                <code className="block bg-gray-950 p-2 rounded mt-2 text-green-300 text-xs">
                  echo CreateObject("WScript.Shell").Run "C:\ruta\completa\scrcpy.exe --turn-screen-off --stay-awake",0,False&gt;"%temp%\_sc.vbs"
                </code>
              </div>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-800/50 transition font-medium flex items-center justify-between text-sm">
                <span>❌ La pantalla del celular no se apaga</span>
                <i className="fas fa-chevron-down text-gray-600 group-open:rotate-180 transition-transform text-xs"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
                <p className="mb-2">Algunos celulares no permiten apagar la pantalla por software. Prueba:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Actualizar scrcpy a la última versión</li>
                  <li>Algunos fabricantes (Samsung, Xiaomi) bloquean esta función</li>
                  <li>Como alternativa, después de iniciar scrcpy ejecuta: <code className="bg-gray-950 px-1.5 py-0.5 rounded text-green-300 text-xs">adb shell input keyevent 26</code></li>
                </ul>
              </div>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-800/50 transition font-medium flex items-center justify-between text-sm">
                <span>❌ El archivo se guarda como .bat.txt</span>
                <i className="fas fa-chevron-down text-gray-600 group-open:rotate-180 transition-transform text-xs"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
                <p className="mb-2">Olvidaste cambiar el tipo a "Todos los archivos". Solución:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Activa "Extensiones de nombre de archivo" en el Explorador</li>
                  <li>Renombra el archivo quitando el <code className="bg-gray-950 px-1 rounded text-red-300">.txt</code></li>
                  <li>Confirma cuando Windows pregunte</li>
                </ol>
              </div>
            </details>

            <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-800/50 transition font-medium flex items-center justify-between text-sm">
                <span>❌ No detecta el celular</span>
                <i className="fas fa-chevron-down text-gray-600 group-open:rotate-180 transition-transform text-xs"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
                <ul className="list-disc list-inside space-y-1">
                  <li>Depuración USB activada en Opciones de desarrollador</li>
                  <li>Acepta el permiso que aparece en la pantalla del celular</li>
                  <li>Usa cable de datos (no solo carga)</li>
                  <li>Prueba <code className="bg-gray-950 px-1 rounded text-green-300 text-xs">adb devices</code> en CMD para verificar</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Tip */}
        <section>
          <div className="bg-blue-950/30 border border-blue-800/30 rounded-2xl p-5">
            <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
              <span>💡</span> Tip: Acceso directo en el escritorio
            </h3>
            <p className="text-sm text-gray-400">
              Para mayor comodidad, crea un acceso directo del <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">scrcpy-silent.bat</code> en tu escritorio:
              click derecho → <strong>Crear acceso directo</strong>. Así puedes iniciar scrcpy con un solo clic desde el escritorio.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-5 text-center text-gray-600 text-xs">
        Guía para scrcpy en Windows • <a href="https://github.com/Genymobile/scrcpy" target="_blank" rel="noopener" className="text-blue-500 hover:underline">scrcpy</a> de Genymobile
      </footer>
    </div>
  );
}

export default App;
