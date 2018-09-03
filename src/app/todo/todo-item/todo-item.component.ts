import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToggleTodoAction, EditarTodoAction, BorrarTodoAction } from '../todo.actions';
import { AppState } from '../../app.reducers';
import { Todo } from '../model/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styles: []
})
export class TodoItemComponent implements OnInit {

  @Input() todo: Todo;
  @ViewChild('txtInputFisico') txtInputFisico: ElementRef;

  chkField: FormControl;
  txtField: FormControl;
  editando: boolean;
  constructor( private store: Store<AppState>) { }

  ngOnInit() {
    this.chkField = new FormControl( this.todo.completado );
    this.txtField = new FormControl( this.todo.texto, Validators.required );
    this.chkField.valueChanges
        .subscribe( () => {
          const accion = new ToggleTodoAction( this.todo.id );
          this.store.dispatch( accion );
        });
  }

  editar() {
    this.editando = true;
    setTimeout( () => {
      this.txtInputFisico.nativeElement.select();
    }, 1 );
  }

  terminarEdicion() {
    this.editando = false;

    if ( this.txtField.invalid ) {
      return;
    }

    if ( this.txtField.value === this.todo.texto ) {
      return;
    }
    const accion = new EditarTodoAction( this.todo.id, this.txtField.value );
    this.store.dispatch( accion );
  }
  borrarTodo() {
    const accion = new BorrarTodoAction( this.todo.id );
    this.store.dispatch( accion );
  }
}
