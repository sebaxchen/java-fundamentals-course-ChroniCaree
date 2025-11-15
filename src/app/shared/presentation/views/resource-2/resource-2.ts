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
  selector: 'app-resource-2',
  imports: [
    NgIf,
    TranslatePipe,
    FormsModule,
    Codemirror6Component
  ],
  templateUrl: './resource-2.html',
  styleUrl: './resource-2.css'
})
export class Resource2 implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;
  code: string = '';
  result: string = '';
  videoUrl!: SafeResourceUrl;
  private animationItem: AnimationItem | null = null;
  private langChangeSubscription?: Subscription;
  exampleCode: string = `// Ejemplo de código JavaScript
function saludar(nombre) {
  return "¡Hola, " + nombre + "!";
}

console.log(saludar("Mundo"));
// Resultado: ¡Hola, Mundo!`;
  videoLink: string = '';
  private videoId: string = '';

  readonly exercises = [
    {
      title: 'resources.exercise1',
      code: `public class Main {

  public static void main(String[] args) {

    int a = 10;

    int b = 3;



    int suma = a + b;

    int resta = a - b;

    int multiplicacion = a * b;

    int division = a / b;

    int resto = a % b;



    System.out.println("Suma: " + suma);

    System.out.println("Resta: " + resta);

    System.out.println("Multiplicación: " + multiplicacion);

    System.out.println("División: " + division);

    System.out.println("Resto: " + resto);



    boolean esMayor = a > b;

    boolean esIgual = a == b;



    System.out.println("¿a es mayor que b? " + esMayor);

    System.out.println("¿a es igual a b? " + esIgual);



    System.out.println("---------------------------------------");



    int nota = 15; 

    if (nota >= 11){

      System.out.println("Aprobaste");

    }else{

      System.out.println("Desaprobaste");

    }



    System.out.println("---------------------------------------");



    int edad = 16;

    if(edad >= 18){

      System.out.println("Eres mayor de edad");

    }else if(edad >= 13){

      System.out.println("Eres adolescente");

    }else{

      System.out.println("Eres niño");

    }



    System.out.println("---------------------------------------");

    

    for (int i = 1; i <= 10; i++){

      System.out.println("Vuelta numero: " + i);

    }



    System.out.println("---------------------------------------");



    int contador = 1;

    while (contador <= 3){

    System.out.println("Intento: " + contador);

    contador = contador + 1;

    }



    System.out.println("---------------------------------------");

      saludar("Snay");

      saludar("Alberto");



      int resultado = sumar(5, 7);

      System.out.println("La suma es: " + resultado);

    }



    static void saludar(String nombre){

      System.out.println("Hola " + nombre + ", bienvenido al curso de Java");

    }



    static int sumar(int a, int b){

      int respuesta = a + b;

      return respuesta;

    }

    

}`
    },
    {
      title: 'resources.exercise2',
      code: `public class Main {
    public static void main(String[] args) {
        int numero = 8;

        if (numero % 2 == 0) {
            System.out.println("Es par");
        } else {
            System.out.println("Es impar");
        }
    }
}`
    },
    {
      title: 'resources.exercise3',
      code: `public class Main {
    public static void main(String[] args) {
        int suma = 0;

        for (int i = 1; i <= 10; i++) {
            suma += i;
        }

        System.out.println("La suma de 1 a 10 es: " + suma);
    }
}`
    },
    {
      title: 'resources.exercise4',
      code: `public class Main {
    public static void main(String[] args) {
        int contador = 5;

        while (contador > 0) {
            System.out.println("Cuenta regresiva: " + contador);
            contador--;
        }

        System.out.println("¡Despegue!");
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
    this.updateVideoUrl();
    this.updateResultMessage();
  }

  private extractVideoId(videoUrl: string): string {
    // Extract video ID from various YouTube URL formats
    // https://youtu.be/RryyYpLgSpk -> RryyYpLgSpk
    // https://www.youtube.com/watch?v=RryyYpLgSpk -> RryyYpLgSpk
    // https://www.youtube.com/embed/RryyYpLgSpk -> RryyYpLgSpk
    const patterns = [
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return videoUrl; // Fallback: return as-is if no pattern matches
  }

  private updateVideoUrl(): void {
    const videoUrl = this.translate.instant('resources.resource2.video');
    if (videoUrl && videoUrl !== 'resources.resource2.video') {
      this.videoLink = videoUrl;
      this.videoId = this.extractVideoId(videoUrl);
      const embedUrl = `https://www.youtube.com/embed/${this.videoId}`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      // Fallback if translation is not available
      this.videoId = 'RryyYpLgSpk';
      this.videoLink = `https://youtu.be/${this.videoId}`;
      const embedUrl = `https://www.youtube.com/embed/${this.videoId}`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  ngOnInit(): void {
    // La animación se carga en ngAfterViewInit
    this.updateResultMessage();
    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateVideoUrl();
      this.updateResultMessage();
      if (!this.code || this.code.trim() === '') {
        this.result = this.translate.instant('resources.codePlaceholder');
      }
    });
    // Update video URL when translations are ready
    this.updateVideoUrl();
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
