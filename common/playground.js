(function() {
    function loadJS(url) {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText)
                }
            }
            xhr.open("GET", url, true)
                // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
            xhr.send()
        })
    }
    require.config({
        paths: {
            'vs': '../node_modules/monaco-editor/min/vs'
        }
    })

    require(['vs/editor/editor.main'], async function() {
        const text = await loadJS('index.js')
        var editor = monaco.editor.create(document.getElementById('editor'), {
            value: text,
            language: 'javascript'
        })
        initEditor(editor)
    });

    function initEditor(editor) {

        function refresh() {
            const iframe = document.createElement('iframe')
            iframe.setAttribute('border', 0)
            iframe.onload = function() {
                var style = document.createElement('style')
                style.type = 'text/css'
                style.innerHTML = `
                body,html{ background: #efefef;margin:0;padding:0 }
                canvas{margin:0;padding:0}
                `
                this.contentDocument.body.appendChild(style)
                const text = editor.getValue()
                var script = iframe.contentDocument.createElement("script")
                script.setAttribute('type', 'module')
                script.textContent = text
                this.contentDocument.body.appendChild(script)
            }

            const container = document.querySelector('#iframe')
            container.innerHTML = ''
            container.appendChild(iframe)

        }
        document.querySelector('#execute').addEventListener('click', refresh, false)
        refresh()
    }
})()