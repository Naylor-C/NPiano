document.addEventListener('DOMContentLoaded', function() {
    const piano = document.getElementById('piano');
    const toggleSoundsBtn = document.getElementById('toggleSounds');
    let soundsEnabled = true;
    
    // Notas musicais para uma oitava
    const notas = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const notasComSustenido = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Mapeamento de teclas do teclado para notas
    const tecladoParaNotas = {
        'a': 'C',
        'w': 'C#',
        's': 'D',
        'e': 'D#',
        'd': 'E',
        'f': 'F',
        't': 'F#',
        'g': 'G',
        'y': 'G#',
        'h': 'A',
        'u': 'A#',
        'j': 'B',
        'k': 'C2',
        'o': 'C#2',
        'l': 'D2'
    };
    
    // Criar teclas do piano
    function criarTeclas() {
        // Teclas brancas
        notas.forEach((nota, index) => {
            const tecla = document.createElement('div');
            tecla.className = 'tecla-branca';
            tecla.dataset.nota = nota;
            tecla.textContent = nota;
            piano.appendChild(tecla);
            
            // Posicionar teclas pretas
            if (['C', 'D', 'F', 'G', 'A'].includes(nota)) {
                const teclaPreta = document.createElement('div');
                teclaPreta.className = 'tecla-preta';
                teclaPreta.dataset.nota = nota + '#';
                
                // Posicionamento relativo às teclas brancas
                const posicao = index * 60 + 45;
                teclaPreta.style.left = `${posicao}px`;
                
                piano.appendChild(teclaPreta);
                
                // Eventos para tecla preta
                adicionarEventosTecla(teclaPreta);
            }
            
            // Eventos para tecla branca
            adicionarEventosTecla(tecla);
        });
    }
    
    // Adicionar eventos a uma tecla
    function adicionarEventosTecla(tecla) {
        tecla.addEventListener('mousedown', function() {
            tocarNota(this.dataset.nota);
            this.classList.add('pressed');
        });
        
        tecla.addEventListener('mouseup', function() {
            this.classList.remove('pressed');
        });
        
        tecla.addEventListener('mouseleave', function() {
            this.classList.remove('pressed');
        });
    }
    
    // Tocar uma nota
    function tocarNota(nota) {
        if (!soundsEnabled) return;
        
        // Criar um oscilador para gerar o som
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscilador = audioContext.createOscillator();
        const ganho = audioContext.createGain();
        
        // Frequências das notas (4ª oitava)
        const frequencias = {
            'C': 261.63, 'C#': 277.18,
            'D': 293.66, 'D#': 311.13,
            'E': 329.63,
            'F': 349.23, 'F#': 369.99,
            'G': 392.00, 'G#': 415.30,
            'A': 440.00, 'A#': 466.16,
            'B': 493.88,
            'C2': 523.25, 'C#2': 554.37,
            'D2': 587.33
        };
        
        oscilador.type = 'sine'; // Tipo de onda (sine, square, sawtooth, triangle)
        oscilador.frequency.value = frequencias[nota] || 440;
        
        // Configurar envelope do som
        ganho.gain.setValueAtTime(0, audioContext.currentTime);
        ganho.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        ganho.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        // Conectar e tocar
        oscilador.connect(ganho);
        ganho.connect(audioContext.destination);
        oscilador.start();
        oscilador.stop(audioContext.currentTime + 0.5);
    }
    
    // Eventos do teclado
    document.addEventListener('keydown', function(e) {
        const nota = tecladoParaNotas[e.key.toLowerCase()];
        if (nota) {
            tocarNota(nota);
            // Encontrar e destacar a tecla correspondente
            const tecla = document.querySelector(`[data-nota="${nota}"]`);
            if (tecla) tecla.classList.add('pressed');
        }
    });
    
    document.addEventListener('keyup', function(e) {
        const nota = tecladoParaNotas[e.key.toLowerCase()];
        if (nota) {
            const tecla = document.querySelector(`[data-nota="${nota}"]`);
            if (tecla) tecla.classList.remove('pressed');
        }
    });
    
    // Botão para ligar/desligar sons
    toggleSoundsBtn.addEventListener('click', function() {
        soundsEnabled = !soundsEnabled;
        this.textContent = soundsEnabled ? 'Desativar Sons' : 'Ativar Sons';
    });
    
    // Inicializar o piano
    criarTeclas();
});
