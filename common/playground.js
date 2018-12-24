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
            'vs': '/node_modules/monaco-editor/min/vs'
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
        const iframe = document.querySelector('iframe')

        function refresh() {
            try {
                const text = editor.getValue()
                var script = iframe.contentDocument.createElement("script")
                script.setAttribute('type', 'module')
                script.textContent = text
                iframe.contentDocument.body.appendChild(script)
            } catch (e) {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
        }
        document.querySelector('#execute').addEventListener('click', refresh, false)
        refresh()
    }
})()