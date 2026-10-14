import { useState } from 'react';

function App() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'vbs' | 'bat' | 'shortcut'>('vbs');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const scripts = [
    {
      title: "Método 1: Archivo VBS (Recomendado)",
      description: "El método más limpio. Un archivo .vbs ejecuta scrcpy sin mostrar ninguna ventana.",
      filename: "scrcpy-silent.vbs",
      code: `CreateObject("WScript.Shell").Run "cmd /c scrcpy --turn-screen-off --stay-awake", 0, False`,
      explanation: `• --turn-screen-off (-S): Apaga la pantalla del celular al iniciar\n• --stay-awake (-w): Mantiene el dispositivo despierto aunque la pantalla esté apagada\n• El parámetro "0" en .Run oculta la ventana de CMD completamente\n• "False" significa que no espera a que termine (no bloquea el script)`
    },
    {
      title: "Método 2: BAT que se auto-oculta",
      description: "Si el .vbs te da problemas, usa este .bat que minimiza su propia ventana al instante.",
      filename: "scrcpy-silent.bat",
      code: `@echo off\n:: Este truco re-lanza el BAT con ventana minimizada\nif not "%1"=="min" start /MIN cmd /c "%~0" min & exit/b\n:: Ahora sí ejecuta scrcpy\nscrcpy --turn-screen-off --stay-awake`,
      explanation: `• La primera vez que se ejecuta, se re-lanza a sí mismo minimizado\n• start /MIN: Inicia una nueva ventana minimizada\n• %~0: Se refiere al propio archivo .bat\n• & exit/b: Cierra la ventana original inmediatamente\n• La ventana parpadea un instante pero queda minimizada en la barra de tareas\n\nNOTA: Verás un icono minimizado en la barra de tareas, pero no una ventana negra visible.`
    },
    {
      title: "Método 3: BAT + PowerShell (sin ventana visible)",
      description: "Usa PowerShell para ejecutar scrcpy completamente oculto.",
      filename: "scrcpy-hidden.bat",
      code: `@echo off\npowershell -WindowStyle Hidden -Command "Start-Process scrcpy -ArgumentList '--turn-screen-off','--stay-awake' -WindowStyle Hidden"`,
      explanation: `• powershell -WindowStyle Hidden: Ejecuta PowerShell sin ventana\n• Start-Process con -WindowStyle Hidden: Lanza scrcpy sin mostrar ventana\n• Este método es muy efectivo para ocultar la ventana de CMD\n• Si scrcpy no está en el PATH, usa la ruta completa: Start-Process "C:\\ruta\\scrcpy.exe"`
    }
  ];

  const vbsFix = `Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\\VBSFile\\Shell\\Open\\Command]
@="\\"C:\\\\Windows\\\\System32\\\\WScript.exe\\" \\"%1\\" %*"

[HKEY_CLASSES_ROOT\\.vbs]
@="VBSFile"
"Content Type"="text/vbscript"
"PerceivedType"="text"`;

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
        {/* ALERT - Problema del VBS */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-exclamation-triangle text-red-400"></i>
              ¿Windows te pide un programa para abrir el .vbs?
            </h2>
            <p className="text-gray-300 mb-4">
              Esto pasa porque el archivo <strong>no se guardó correctamente como .vbs</strong>. 
              Probablemente se guardó como <code className="bg-gray-700 px-1.5 py-0.5 rounded text-red-300">scrcpy-silent.vbs.txt</code> — 
              el Bloc de notas agrega <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">.txt</code> automáticamente.
            </p>
            
            <div className="space-y-4">
              {/* Solución 1 */}
              <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold">1</span>
                  Solución rápida: Mostrar extensiones de archivo
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 ml-8">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Abre el <strong>Explorador de archivos</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Arriba haz clic en <strong>"Vista"</strong> (o "Ver")
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Marca la casilla <strong>"Extensiones de nombre de archivo"</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Ahora verás que tu archivo dice <code className="bg-gray-700 px-1 rounded text-red-300">scrcpy-silent.vbs.txt</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Renómbralo quitando el <code className="bg-gray-700 px-1 rounded text-red-300">.txt</code> del final → debe quedar <code className="bg-gray-700 px-1 rounded text-green-300">scrcpy-silent.vbs</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Windows te preguntará si estás seguro → di que <strong>Sí</strong>
                  </li>
                </ol>
              </div>

              {/* Solución 2 */}
              <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold">2</span>
                  Solución alternativa: Guardar correctamente desde el Bloc de notas
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 ml-8">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Abre el Bloc de notas y pega el código del script
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Ve a <strong>Archivo → Guardar como</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    En "Tipo" cambia de "Documentos de texto (*.txt)" a <strong>"Todos los archivos (*.*)"</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    En "Nombre" escribe: <code className="bg-gray-700 px-1 rounded text-green-300">scrcpy-silent.vbs</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">→</span>
                    Guárdalo en la carpeta de scrcpy
                  </li>
                </ol>
              </div>

              {/* Solución 3 - Registro */}
              <details className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden group">
                <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    Si nada funciona: Reparar asociación .vbs en el registro
                  </span>
                  <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                  <p className="mb-3">Si Windows no sabe qué programa usar para abrir .vbs, la asociación está rota. Crea un archivo .reg con este contenido y ejecútalo:</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">📄 fix-vbs.reg</span>
                    <button
                      onClick={() => copyToClipboard(vbsFix, 100)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        copiedIndex === 100 ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <i className={`fas ${copiedIndex === 100 ? 'fa-check' : 'fa-copy'}`}></i>
                      {copiedIndex === 100 ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-700/50 rounded-lg p-3 overflow-x-auto text-xs">
                    <code className="text-green-300 font-mono whitespace-pre">{vbsFix}</code>
                  </pre>
                  <p className="mt-2 text-gray-400">Doble clic en el .reg → Aceptar → Reiniciar el explorador. Después ya podrás ejecutar .vbs con doble clic.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Métodos alternativos */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-exchange-alt text-blue-400"></i>
            Métodos alternativos (si el .vbs sigue sin funcionar)
          </h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTab('vbs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'vbs' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-file-code mr-2"></i>VBS
            </button>
            <button
              onClick={() => setActiveTab('bat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bat' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-file mr-2"></i>BAT auto-oculto
            </button>
            <button
              onClick={() => setActiveTab('shortcut')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'shortcut' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-link mr-2"></i>Acceso directo
            </button>
          </div>

          {activeTab === 'vbs' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-2">Archivo VBS</h3>
              <p className="text-gray-400 text-sm mb-4">
                Es el método más limpio. No muestra NINGUNA ventana. Solo necesitas que Windows ejecute archivos .vbs correctamente.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-300">
                  <i className="fas fa-info-circle mr-1"></i>
                  <strong>Importante:</strong> Asegúrate de que la extensión sea .vbs y NO .vbs.txt. 
                  Activa "Extensiones de nombre de archivo" en el Explorador para verificar.
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">📄 scrcpy-silent.vbs</span>
                <button
                  onClick={() => copyToClipboard(scripts[0].code, 0)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    copiedIndex === 0 ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <i className={`fas ${copiedIndex === 0 ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedIndex === 0 ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <pre className="bg-gray-900 border border-gray-700/50 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-300 font-mono whitespace-pre">{scripts[0].code}</code>
              </pre>
              <div className="mt-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Explicación:</p>
                <p className="text-sm text-gray-300 whitespace-pre-line">{scripts[0].explanation}</p>
              </div>
            </div>
          )}

          {activeTab === 'bat' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-2">BAT que se auto-minimiza</h3>
              <p className="text-gray-400 text-sm mb-4">
                Este método usa un archivo .bat (que SÍ funciona con doble clic siempre). 
                El truco: se re-lanza minimizado y cierra la ventana original.
              </p>
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-300">
                  <i className="fas fa-info-circle mr-1"></i>
                  <strong>Ventaja:</strong> Los archivos .bat siempre funcionan con doble clic en Windows. No necesitas reparar asociaciones.
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500 bg-gray-700/50 px-2 py-1 rounded">📄 scrcpy-silent.bat</span>
                <button
                  onClick={() => copyToClipboard(scripts[1].code, 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    copiedIndex === 1 ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <i className={`fas ${copiedIndex === 1 ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedIndex === 1 ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <pre className="bg-gray-900 border border-gray-700/50 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-300 font-mono whitespace-pre">{scripts[1].code}</code>
              </pre>
              <div className="mt-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Explicación:</p>
                <p className="text-sm text-gray-300 whitespace-pre-line">{scripts[1].explanation}</p>
              </div>
            </div>
          )}

          {activeTab === 'shortcut' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-2">Acceso directo minimizado</h3>
              <p className="text-gray-400 text-sm mb-4">
                Crea un acceso directo a scrcpy.exe y configúralo para que se ejecute minimizado. 
                La ventana de CMD aparecerá brevemente en la barra de tareas pero no será visible.
              </p>
              <ol className="text-sm text-gray-300 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Click derecho en <code className="bg-gray-700 px-1 rounded text-xs">scrcpy.exe</code> → <strong>"Crear acceso directo"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click derecho en el acceso directo → <strong>Propiedades</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <span>En el campo <strong>"Destino"</strong>, agrega los parámetros al final:</span>
                    <div className="flex items-center justify-between mt-1 mb-1">
                      <code className="bg-gray-900 px-2 py-1 rounded text-green-300 text-xs block w-full">"C:\ruta\scrcpy.exe" --turn-screen-off --stay-awake</code>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">4</span>
                  <span>En <strong>"Ejecutar"</strong> selecciona: <strong>"Minimizada"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">5</span>
                  <span>Click <strong>Aplicar</strong> → <strong>Aceptar</strong></span>
                </li>
              </ol>
              <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                <p className="text-sm text-blue-300">
                  <i className="fas fa-info-circle mr-1"></i>
                  <strong>Nota:</strong> Verás un icono de CMD minimizado en la barra de tareas mientras scrcpy esté activo. 
                  Si no quieres ni eso, usa el método .bat o repara el .vbs.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Todos los scripts */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-code text-purple-400"></i>
            Todos los scripts disponibles
          </h2>

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
                      onClick={() => copyToClipboard(script.code, index + 10)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        copiedIndex === index + 10
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <i className={`fas ${copiedIndex === index + 10 ? 'fa-check' : 'fa-copy'}`}></i>
                      {copiedIndex === index + 10 ? '¡Copiado!' : 'Copiar'}
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

        {/* Pasos rápidos */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-rocket text-yellow-400"></i>
            Pasos para crear el archivo correctamente
          </h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium">Primero: Activa las extensiones de archivo</p>
                  <p className="text-sm text-gray-400">
                    Explorador → Vista → Marca <strong>"Extensiones de nombre de archivo"</strong>
                    <br />Esto es CRUCIAL para que no te engañe el Bloc de notas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium">Abre el Bloc de notas</p>
                  <p className="text-sm text-gray-400">
                    Presiona <code className="bg-gray-700 px-1 rounded text-xs">Win + R</code>, escribe <code className="bg-gray-700 px-1 rounded text-xs">notepad</code> y presiona Enter
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium">Pega el código del script</p>
                  <p className="text-sm text-gray-400">
                    Copia el script que prefieras (recomendado: el VBS o el BAT) y pégalo en el Bloc de notas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium">Guardar como correctamente</p>
                  <p className="text-sm text-gray-400">
                    <strong>Archivo → Guardar como</strong>
                    <br />
                    • Donde guardar: <strong>Carpeta de scrcpy</strong> (donde está scrcpy.exe)
                    <br />
                    • Nombre del archivo: <code className="bg-gray-700 px-1 rounded text-xs">scrcpy-silent.vbs</code> (o .bat)
                    <br />
                    • <span className="text-red-400 font-semibold">Tipo: "Todos los archivos (*.*)"</span> ← ¡MUY IMPORTANTE!
                    <br />
                    • Codificación: ANSI o UTF-8
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <p className="font-medium">Verifica la extensión</p>
                  <p className="text-sm text-gray-400">
                    Ve a la carpeta y confirma que el archivo se ve como <code className="bg-gray-700 px-1 rounded text-green-300">scrcpy-silent.vbs</code> 
                    y NO como <code className="bg-gray-700 px-1 rounded text-red-300">scrcpy-silent.vbs.txt</code>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">6</span>
                <div>
                  <p className="font-medium">¡Ejecuta con doble clic!</p>
                  <p className="text-sm text-gray-400">
                    Conecta tu celular por USB → Doble clic en el archivo → La ventana de scrcpy aparecerá sin CMD
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
            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group" open>
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ Windows me pide un programa para abrir el .vbs</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2"><strong>Causa:</strong> El archivo tiene extensión .txt oculta (se llama realmente .vbs.txt)</p>
                <p className="mb-2"><strong>Solución:</strong></p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>Activa "Extensiones de nombre de archivo" en el Explorador</li>
                  <li>Renombra el archivo quitando el .txt del final</li>
                  <li>O guarda correctamente usando "Tipo: Todos los archivos"</li>
                </ul>
                <p><strong>Alternativa:</strong> Usa el método .bat que siempre funciona con doble clic.</p>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ "scrcpy no se reconoce como comando"</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2">El script no encuentra scrcpy. Soluciones:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Guarda el script DENTRO de la carpeta de scrcpy</li>
                  <li>O usa la ruta completa en el script:</li>
                </ul>
                <code className="block bg-gray-900 p-2 rounded mt-2 text-green-300 text-xs">
                  CreateObject("WScript.Shell").Run "cmd /c C:\scrcpy\scrcpy.exe --turn-screen-off --stay-awake", 0, False
                </code>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ La pantalla del celular no se apaga</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <p className="mb-2">Algunos celulares no permiten apagar la pantalla por software. Intenta:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Verifica que tu scrcpy sea versión 2.0 o superior</li>
                  <li>Algunos fabricantes (Samsung, Xiaomi) pueden bloquear esta función</li>
                  <li>Como alternativa, usa: <code className="bg-gray-900 px-1 rounded">adb shell input keyevent 26</code> después de iniciar scrcpy (simula presionar el botón de encendido)</li>
                </ul>
              </div>
            </details>

            <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors font-medium flex items-center justify-between">
                <span>❌ "device not found" / no detecta el celular</span>
                <i className="fas fa-chevron-down text-gray-500 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700/30 pt-3">
                <ul className="list-disc list-inside space-y-1">
                  <li>Depuración USB activada en Opciones de desarrollador</li>
                  <li>Acepta el permiso en la pantalla del celular</li>
                  <li>Usa cable de datos (no solo carga)</li>
                  <li>Ejecuta <code className="bg-gray-900 px-1 rounded">adb devices</code> para verificar</li>
                  <li>Instala drivers USB del fabricante si es necesario</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-star text-yellow-400"></i>
            Tips adicionales
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">🔋 Ahorro de batería</h4>
              <p className="text-sm text-gray-300">
                Con la pantalla apagada tu celular consume mucha menos batería. 
                El flag <code className="bg-gray-700 px-1 rounded text-xs">--stay-awake</code> evita que se bloquee.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">📶 Usar por WiFi</h4>
              <p className="text-sm text-gray-300">
                Primero conecta por USB, luego:
                <code className="block bg-gray-900 p-2 rounded mt-2 text-green-300 text-xs">
                  adb tcpip 5555{'\n'}adb connect IP:5555{'\n'}scrcpy -S
                </code>
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">⌨️ Acceso directo en escritorio</h4>
              <p className="text-sm text-gray-300">
                Crea un acceso directo del .vbs o .bat en tu escritorio para ejecutar scrcpy con un solo clic.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-400 mb-2">🎮 Jugar desde la PC</h4>
              <p className="text-sm text-gray-300">
                Usa <code className="bg-gray-700 px-1 rounded text-xs">--turn-screen-off</code> para jugar con la pantalla del celular apagada y ahorrar batería mientras juegas desde la PC.
              </p>
            </div>
          </div>
        </section>

        {/* Comandos */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-terminal text-cyan-400"></i>
            Referencia de comandos
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
                  <td className="p-3 text-gray-300">Apaga la pantalla del dispositivo</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--stay-awake, -w</code></td>
                  <td className="p-3 text-gray-300">Mantiene el dispositivo despierto</td>
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
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--fullscreen, -f</code></td>
                  <td className="p-3 text-gray-300">Inicia en pantalla completa</td>
                </tr>
                <tr>
                  <td className="p-3"><code className="text-green-300 font-mono text-xs">--always-on-top</code></td>
                  <td className="p-3 text-gray-300">Ventana siempre encima de las demás</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-6 text-center text-gray-500 text-sm">
        <p>Guía para scrcpy en Windows • <a href="https://github.com/Genymobile/scrcpy" target="_blank" rel="noopener" className="text-blue-400 hover:underline">scrcpy</a> de Genymobile</p>
      </footer>
    </div>
  );
}

export default App;
