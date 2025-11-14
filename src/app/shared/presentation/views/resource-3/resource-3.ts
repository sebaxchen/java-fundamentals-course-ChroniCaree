import { Component } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Codemirror6Component } from '../../components/codemirror6/codemirror6';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { foldGutter, foldKeymap, bracketMatching } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLine, keymap } from '@codemirror/view';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

@Component({
  selector: 'app-resource-3',
  imports: [
    TranslatePipe,
    FormsModule,
    Codemirror6Component
  ],
  templateUrl: './resource-3.html',
  styleUrl: './resource-3.css'
})
export class Resource3 {
  code: string = '';
  result: string = 'Escribe código en el editor para ver los resultados aquí...';
  videoUrl: SafeResourceUrl;
  exampleCode: string = `// Ejemplo de código JavaScript
function saludar(nombre) {
  return "¡Hola, " + nombre + "!";
}

console.log(saludar("Mundo"));
// Resultado: ¡Hola, Mundo!`;

  readonly exercises = [
    {
      title: 'Ejercicio 1',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("¿Cómo te llamas? ");
        String nombre = scanner.nextLine();

        System.out.println("Hola " + nombre + ", bienvenido al mundo de Java.");

        scanner.close();
    }
}`
    },
    {
      title: 'Ejercicio 2',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("¿Cómo te llamas? ");
        String nombre = scanner.nextLine();

        System.out.print("¿Cuántos años tienes? ");
        int edad = scanner.nextInt();
        scanner.nextLine();

        System.out.println("Hola " + nombre + ", tienes " + edad + " años.");

        scanner.close();
    }
}`
    },
    {
      title: 'Ejercicio 3',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int[] notas = new int[3];
        int suma = 0;

        for (int i = 0; i < notas.length; i++) {
            System.out.print("Ingresa la nota " + (i + 1) + ": ");
            notas[i] = scanner.nextInt();
            suma += notas[i];
        }

        double promedio = suma / (double) notas.length;
        System.out.println("Tu promedio es: " + promedio);

        if (promedio >= 11) {
            System.out.println("¡Aprobaste, buen trabajo!");
        } else {
            System.out.println("No te rindas, puedes mejorar.");
        }

        scanner.close();
    }
}`
    },
    {
      title: 'Ejercicio 4',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] juegos = new String[3];

        for (int i = 0; i < juegos.length; i++) {
            System.out.print("Escribe tu juego favorito #" + (i + 1) + ": ");
            juegos[i] = scanner.nextLine();
        }

        System.out.println("Tus juegos favoritos son:");
        for (int i = 0; i < juegos.length; i++) {
            System.out.println("- " + juegos[i]);
        }

        scanner.close();
    }
}`
    }
  ];

  readonly leftExercises = this.exercises.slice(0, 2);
  readonly rightExercises = this.exercises.slice(2);

  extensions: Extension[] = [
    lineNumbers(),
    history(),
    foldGutter(),
    bracketMatching(),
    closeBrackets(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap
    ]),
    java(),
    syntaxHighlighting(HighlightStyle.define([
      { tag: tags.keyword, color: '#569cd6' },
      { tag: tags.string, color: '#ce9178' },
      { tag: tags.comment, color: '#6a9955' },
      { tag: tags.number, color: '#b5cea8' },
      { tag: tags.definition(tags.variableName), color: '#9cdcfe' },
      { tag: tags.variableName, color: '#9cdcfe' },
      { tag: tags.typeName, color: '#4ec9b0' },
      { tag: tags.function(tags.variableName), color: '#dcdcaa' },
      { tag: tags.className, color: '#4ec9b0' },
      { tag: tags.propertyName, color: '#9cdcfe' },
      { tag: tags.operator, color: '#d4d4d4' },
      { tag: tags.punctuation, color: '#d4d4d4' },
      { tag: tags.bracket, color: '#d4d4d4' },
      { tag: tags.meta, color: '#d4d4d4' }
    ])),
    EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '0.8rem',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4'
      },
      '.cm-editor': {
        height: '100%',
        backgroundColor: '#1e1e1e'
      },
      '.cm-scroller': {
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#1e1e1e'
      },
      '.cm-content': {
        padding: '0.75rem',
        fontFamily: "'Courier New', 'Monaco', 'Menlo', monospace",
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        caretColor: '#d4d4d4'
      },
      '.cm-focused': {
        outline: 'none'
      },
      '.cm-line': {
        color: '#d4d4d4'
      },
      '.cm-gutters': {
        backgroundColor: '#1e1e1e',
        border: 'none',
        color: '#858585'
      },
      '.cm-lineNumbers .cm-gutterElement': {
        color: '#858585'
      },
      '.cm-activeLine': {
        backgroundColor: '#2a2d2e'
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#2a2d2e',
        color: '#d4d4d4'
      }
    })
  ];

  constructor(private sanitizer: DomSanitizer) {
    const videoId = '1pJv1WWjRPU';
    const url = `https://www.youtube.com/embed/${videoId}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onCodeChange() {
    if (!this.code || this.code.trim() === '') {
      this.result = 'Escribe código en el editor para ver los resultados aquí...';
      return;
    }

    try {
      const output: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args: any[]) => {
        output.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      console.error = (...args: any[]) => {
        output.push('ERROR: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      eval(this.code);
      
      console.log = originalLog;
      console.error = originalError;
      
      this.result = output.length > 0 ? output.join('\n') : '✓ Código ejecutado correctamente (sin salida)';
    } catch (error: any) {
      this.result = `✗ Error: ${error.message}`;
    }
  }

  loadExample() {
    this.code = this.exampleCode;
    this.onCodeChange();
  }
}
