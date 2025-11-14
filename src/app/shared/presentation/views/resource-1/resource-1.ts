import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
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
import lottie from 'lottie-web';
import { AnimationItem } from 'lottie-web';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resource-1',
  imports: [
    NgIf,
    TranslatePipe,
    FormsModule,
    Codemirror6Component
  ],
  templateUrl: './resource-1.html',
  styleUrl: './resource-1.css'
})
export class Resource1 implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;
  code: string = '';
  result: string = '';
  videoUrl: SafeResourceUrl;
  private animationItem: AnimationItem | null = null;
  private langChangeSubscription?: Subscription;
  exampleCode: string = `// Ejemplo de código JavaScript
function saludar(nombre) {
  return "¡Hola, " + nombre + "!";
}

console.log(saludar("Mundo"));
// Resultado: ¡Hola, Mundo!`;
  readonly videoId = 'y71frNkA6vk';
  readonly videoLink = `https://youtu.be/${this.videoId}`;

  readonly exercises = [
    {
      title: 'resources.exercise1',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Ingresa tu edad: ");
        int edad = scanner.nextInt();

        System.out.println("En 5 años tendrás: " + (edad + 5));
        scanner.close();
    }
}`
    },
    {
      title: 'resources.exercise2',
      code: `public class Main {
    public static void main(String[] args) {
        String lenguaje = "Java";
        String mensaje = String.format("Aprender %s es divertido.", lenguaje);

        System.out.println(mensaje);
    }
}`
    },
    {
      title: 'resources.exercise3',
      code: `public class Main {
    public static void main(String[] args) {
        double precio = 19.99;
        int cantidad = 3;

        double total = precio * cantidad;
        System.out.println("Total a pagar: " + total);
    }
}`
    },
    {
      title: 'resources.exercise4',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Ingresa tu nombre: ");
        String nombre = scanner.nextLine();

        System.out.println("Hola " + nombre + ", ¡este es tu primer programa en Java!");
        scanner.close();
    }
}`
    }
  ];

  currentExerciseIndex = 0;
  get currentExercise() {
    return this.exercises[this.currentExerciseIndex] ?? null;
  }

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

  constructor(
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    const url = `https://www.youtube.com/embed/${this.videoId}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.updateResultMessage();
  }

  ngOnInit(): void {
    // La animación se carga en ngAfterViewInit
    this.updateResultMessage();
    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateResultMessage();
      if (!this.code || this.code.trim() === '') {
        this.result = this.translate.instant('resources.codePlaceholder');
      }
    });
  }

  private updateResultMessage() {
    this.result = this.translate.instant('resources.codePlaceholder');
  }

  ngAfterViewInit(): void {
    if (this.lottieContainer) {
      const container = this.lottieContainer.nativeElement;
      container.style.width = '300px';
      container.style.height = '300px';
      
      this.animationItem = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/i18n/STUDENT.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet'
        }
      });
      
      // Asegurar que el SVG tenga el tamaño correcto
      setTimeout(() => {
        const svg = container.querySelector('svg');
        if (svg) {
          svg.style.width = '250px';
          svg.style.height = '250px';
          svg.style.transform = 'scale(1)';
          svg.style.transformOrigin = 'center center';
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (this.animationItem) {
      this.animationItem.destroy();
    }
  }

  showNextExercise() {
    if (this.exercises.length === 0) {
      return;
    }

    this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.exercises.length;
  }

  onCodeChange() {
    if (!this.code || this.code.trim() === '') {
      this.result = this.translate.instant('resources.codePlaceholder');
      return;
    }

    try {
      // Ejecutar código JavaScript básico
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

      // Ejecutar el código
      eval(this.code);
      
      // Restaurar console.log y console.error
      console.log = originalLog;
      console.error = originalError;
      
      const successMessage = this.translate.instant('resources.codeExecutedSuccessfully');
      this.result = output.length > 0 ? output.join('\n') : successMessage;
    } catch (error: any) {
      const errorLabel = this.translate.instant('resources.error');
      this.result = `${errorLabel}: ${error.message}`;
    }
  }

  loadExample() {
    this.code = this.exampleCode;
    this.onCodeChange();
  }
}
