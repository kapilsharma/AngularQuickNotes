# Models, Services and Dependency Injection

Directives (mainly Components) are helping us shape initial draft of our application and it is working very well.

However, if you are a developer, who values better code architecture like separations of concerns, SOLID Principle, mainly Singe Responsibility Principle, you might have noticed something do not seems right.

The architecture we made if fine for ToDo app but in case we need to design some really big application with multiple modules, things are not be loosely coupled as they should be.

In case you have not noticed, let's find some issue in our current ToDo application (v6.4.3).

**Problem 1:** There is a big 'toDos' array in ToDoComponent. Thinking in terms of responsibilities, ToDoComponent is responsible for ToDo. In MVC terms, it is ToDoController, it need to control whole flow but by defining ToDos array, it is also taking responsibility of Model (data layer). Agreed we still didn't learned how to communicate with server to load data, still, ToDoController do not seems right place for defining ToDos.

## Models

To solve this problem, let's create a ToDo model. Model is a simple data class, which holds the data. To be precise, ToDo will hold the data of one ToDo. Again, since we can have multiple models in the application, it make sense to make separate folder for models. Let's create folder 'app/models'.

**app/models/ToDo.ts**

```typescript
export class ToDo {
  name: string;
  done: boolean;
  category: string;

  constructor(name: string, done: boolean, category: string) {
    this.name = name;
    this.done = done;
    this.category = category;
  }
}
```

> Models are representation of data (say one row in DB table) in object form.

ToDo class doesn't need much explanation. It is simple TypeScript class having 3 variables. We are setting these variables through constructor.

We also need to do necessary changes in ToDo Component to use our new model.

**app/to-do/to-do.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';

import { ToDo } from '../models/ToDo';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  toDos: Array<ToDo> = [];

  onToDoAdded(toDo: {
    name: string,
    category: string
  }) {
    this.toDos.push({
      name: toDo.name,
      done: false,
      category: toDo.category
    });
  }

  constructor() {
    this.toDos.push(new ToDo('Angular Session 1', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 1 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 2', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 2 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 3', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 3 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Schedule Angular meet up 2', false, 'PHPReboot'));
    this.toDos.push(new ToDo('Update Angular quick notes EBook', false, 'EBooks'));
  }

  ngOnInit() { }
}
```

Here, in line 12, we removed all the ToDo assignment in variable toDos. Here, after colon(:), we are defining that toDos variable will contain an array of ToDo objects. `Array<ToDo>` is Type Script syntax to define that.

We import ToDo model in line 3 and pushing new ToDo Model in the constructor Line 26-33.

We need not to make any change in TodoComponent HTML & ListComponent TS & HTML file. With this, our application is behaving as earlier, but with some better decoupling and separation of concern.

> Code till here is committed in branch `v7.1.0`.

## Services & Dependency Injection

A service is a Type Script class with a narrow and well-defined purpose. As a general coding best practice, it do something specific (small, single responsibility) but do it very well.

Main purpose of service is to provide reusable code that we can reuse in multiple components (DRY Principle). Angular distinguishes components from services to increase modularity and reusability. By separating a component's view-related functionality from other kinds of processing, you can make your component classes lean and efficient.

We just saw Models and like services, it is also a Type Script class, so what is the difference between Service & Model or any other TS class? Major difference is dependency injection.

We already saw ToDo model class. With this, we are making new object of ToDo model in the constructor of our ToDoComponent. This is called a tight coupling, now our ToDoComponent is tightly coupled with ToDo modal class. This also make it difficult to test, which we will be discussing later in a chapter dedicated to testing. However, we need array of ToDo models, how can we get rid of this tight coupling.

> Whenever you use 'new' keyword, always think you are making a tight coupling. Is there any other way around?

**Dependency Injection**

Dependency injection is a programming concept, which makes our code loosely coupled. It says, instead of creating an instance where you need, pass that instance from a central place.

Our components are also classes that means, someone is creating their instances, who? Well, Angular do that for us. It create instance of our components. It can also create instance of other Type Script classes, provided we tell it how to do that. Services is just that way, Angular can create instance of services in an optimized way and may provide us same instance, where ever we need it.

Let's understand it with an example.

## ToDoService

Using ToDo Model, we removed big array from our ToDoComponent class. However, now we are creating instance of ToDo models in constructor. A 'new' keyword in ToDoComponent raise few questions.

- Components are responsible to correctly show data. Is our ToDoComponent trying to do more that it should?
- ToDoComponent is creating instance of ToDo model, it is really responsible for it?
- Is ToDo component following Single Responsibility Principle?

Unfortunately, answer to all of above questions is 'No'. This suggest ToDoComponent needs refactoring. To do that, let's first create ToDoService, which should hold business logic to manage ToDos.

```bash
ng g s services/ToDo --no-spec
```

This will create a service ToDoService in file 'app/services/to-do.services.ts'. Now we want to first manage our ToDos in ToDoService, let's update some code.

**app/services/to-do.service.ts**

```typescript
import { Injectable } from '@angular/core';

import { ToDo } from '../models/ToDo';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  toDos: Array<ToDo> = [];

  constructor() {
    // Once we learn about Http service, we will load this data from server.
    this.toDos.push(new ToDo('Angular Session 1', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 1 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 2', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 2 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 3', true, 'Angular'));
    this.toDos.push(new ToDo('Angular Session 3 Assignment', true, 'Angular'));
    this.toDos.push(new ToDo('Schedule Angular meet up 2', false, 'PHPReboot'));
    this.toDos.push(new ToDo('Update Angular quick notes EBook', false, 'EBooks'));
  }

  addToDo(name: string, category: string) {
    this.toDos.push(new ToDo(name, false, category));
  }
}
```

Injectable (line 1 and 5-7) is the default code generated by CLI, we will learn about it shortly.

Line 3 is importing ToDo model, which we obviously need to hold ToDos. Most of the other code here is taken from ToDoComponent. Line 10 is simply defining a class variable to hold an array of ToDo models. Constructor (Line 12-22) is exactly copied from ToDoComponent. 'addToDo' method (Line 24-26) is basically the copy of 'onToDoAdded' method of ToDoComponent but we simplified the parameters.

Now we have the required service, let's update ToDoComponent to use it.

**app/to-do/to-do.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';

import { ToDo } from '../models/ToDo';
import { ToDoService } from '../services/to-do.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  toDos: Array<ToDo> = [];

  onToDoAdded(toDo: {
    name: string,
    category: string
  }) {
    this.toDoService.addToDo(toDo.name, toDo.category);
  }

  constructor(private toDoService: ToDoService) {
    this.toDos = this.toDoService.toDos;
  }

  ngOnInit() { }
}
```

Now our component class is getting much simpler. Most important change is our constructor. You could notice `private toDoService: ToDoService` as parameter. This is Type Script's short cut to define private class variable. Example

```typescript
export class PrivateClassVariableExample {
    private classVariable: SomeClass;
    
    constructor(classVariable: SomeClass) {
        this.classVariable = classVariable;
    }
}
```

This code is exactly equivalent to

```typescript
export class PrivateClassVariableExample {
    constructor(private classVariable: SomeClass) {}
}
```

> Type Script (and ES6) have many of such shortcuts, which we will see when needed. Once this book is complete, I'll be adding a separate chapters on ES6 and Type Script. This could be helpful for someone not familiar with ES6 or Type Script.

We still need to manage toDos variable in ToDoComponent as we need to pass it to ListComponent. Thus, in line 23, we are making it as a copy of toDos variable of ToDoService. However, by this, we are not using services effectively and we will soon get rid of it.

Another important thing to note in constructor, we said we need a parameter of type ToDoService, we never created an instance of our service. This is Dependency Injection. We will learn more about it once we go through all the changes.

Our 'onToDoAdded' method (line 15) is also simplified. Now it is just calling 'addToDo' method of ToDoService.

With these changes, our application is working exactly as it was working earlier but we are now using ToDoService.

### How Dependency Injection is working?

In last example, we never created an object of ToDoService, yet it is available as constructor's parameter. Obviously someone or something is creating these objects. It is Angular, which is doing this job for us. However, we need to tell angular the strategy to create objects. In above example, Angular will create only one instance of ToDoService and pass same instance anywhere we want through Dependency Injection (parameter type). Thus, our ToDoService is virtually acting as Singleton class with only one instance (Virtually because you can create new instance with 'new' keyword). We actually told Angular to do this through `providedIn: 'root'` passed in parameter object of Injectable decorator.

There could be cases where we wish to create multiple instance of a service. We can tell this to angular.

### Hierarchical Injector

Dependency Injection in angular needs two things:

- Provider: tells angular how and when to create a new instance and where to pass existing one.
- Type-hinting: tells angular which class's object is needed.

Here, providers are important to control hierarchical injector behavior. Angular, by default, do not create instance of service during injecting. It just pass existing instance from current or parent component. Thus, object created in one component, will be available in all child components.

### How to get new instance?

Well, its good to have single instance of service in most of the cases as we will soon learn how to use services as data services. It also make sense as service have reusable code, therefore making different instance of a service doesn't make much sense. However, if for some requirements, we need different instance of same service in different components, it can be done through providers.

In our example, we passed `providedIn: 'root'` in Injectable decorator. It means, object will be created at root of application and all child components (all components are children of root) should get same instance. In other words, with `providedIn: 'root'` we said we need same instance of the class in whole application.

Angular applications are divided in modules. We will learn more about modules later but for now, every application have one or more module. Our ToDoApplication have one module AppModule that we are configuring in 'app/app.module.ts' file. Every module is a collection of multiple components. These components are also hierarchical. In our application, till now, AppComponent loads ToDoComponent and therefore, AppComponent is parent component of ToDoComponent or ToDoComponent is child component of AppComponent. Similarly, ToDoComponent is parent component of CreateComponent and ListComponent.

If we want a service to be available only for the components of a particular module, we will not add `providedIn: 'root'` in Injectable decorator of service but we will add ToDoService in provider array of app.module.ts.

**app/services/to-do.service.ts**

~~~ { .typescript .numberLines startFrom="5"}
  @Injectable()
  export class ToDoService {
~~~

**app/app.module.ts**

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { ToDoComponent } from './to-do/to-do.component';
import { ListComponent } from './to-do/list/list.component';
import { CreateComponent } from './to-do/create/create.component';
import { ToDoService } from './services/to-do.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ToDoComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ToDoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Here, we removed `providedIn: 'root'` from service's injectable decorator but added in provider's array of AppModule's NgModule decorator. Now ToDoService is available only in app module but since our whole application is designed in single module, it will not make any difference.

Now let's assume we want our ToDoService only in ToDoComponent and its child components. To do this, let's revert changes in 'app.module.ts' file and add providers in ToDoComponent. We can do it in providers array in component decorator.

**app/to-do/to-do.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';

import { ToDo } from '../models/ToDo';
import { ToDoService } from '../services/to-do.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css'],
  providers: [ToDoService]
})
export class ToDoComponent implements OnInit {

  toDos: Array<ToDo> = [];

  onToDoAdded(toDo: {
    name: string,
    category: string
  }) {
    this.toDoService.addToDo(toDo.name, toDo.category);
  }

  constructor(private toDoService: ToDoService) {
    this.toDos = this.toDoService.toDos;
  }

  ngOnInit() { }
}
```

As we can see in line 10, we added provider's array in Component decorator.

A provider simply tell Angular to create a new instance of service for this Component and its child components. Actual instance will be passed through dependency injection (type hinting). As we will see in some time, we also need ToDoService in ListComponent. For this, we will make similar constructor in ListComponent. However, if we do not add provider in ListComponent, new instance of ToDoService will not be created. Angular will check it's parent component (ToDoComponent) for the instance of ToDoService and pass the one created for ToDoComponent.

> Code till here is committed in branch v7.3.3

## Data service

Service can also be used as data service. Why it is needed? In our list component, we need to show toDos. For this, we are using custom property binding to get toDos variable from parent component (ToDoComponent). This is fine for now as we need to pass data from immediate parent but in case there is a long hierarchy or we need to share data between two sibling components (Components having same parent), there will be a long chain of @Input() and @Output(). Thus, we can also use services to share data between two components distantly related. Let's see it with an example.

First, since our ToDoService hold the list of toDos, we need not to pass that data from 'to-do.component.html' to 'list.component.ts'. Let's first remove this.

**app/to-do/to-do.component.html**

```html
<app-create (toDoAdded)="onToDoAdded($event)">Add new ToDo</app-create>
<app-list>ToDo List</app-list>
```

We removed custom property binding from line 2. Since we are not having custom property binding, toDos variable in ListComponent may also be removed.

**app/to-do/list/list.component.ts**

```typescript
import {Component, Input, OnInit} from '@angular/core';
import {ToDoService} from '../../services/to-do.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(public toDoService: ToDoService) {
  }

  ngOnInit() {
  }
}
```

We removed variable 'toDos' but we still need to do list from toDoService. Thus, our constructor now have ToDoService injected. Notice `public`, it will make the variable as class variable, which can be used in HTML.

Last, we need to use toDoService variable instead of toDos in HMTL

**app/to-do/list/list.component.html**

```html
<div class="row">
  <div class="col">
    <h2>
      <ng-content></ng-content>
    </h2>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">ToDo</th>
        <th scope="col">Category</th>
        <th scope="col">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let toDo of toDoService.toDos;">
        <td><input type="checkbox" class="form-control" [checked]="toDo.done"></td>
        <td [ngClass]="toDo.done ? '' : 'bold'">{{ toDo.name }}</td>
        <td>{{ toDo.category }}</td>
        <td>
          <button class="btn btn-info mr-2">Edit</button>
          <button class="btn btn-danger">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
```

We just change 'toDos' to 'toDoService.toDos' in line 16.

Last but probably most important, we want to tell angular to create new instance of ToDoService for ToDoComponent and all its child components. We also do not need 'toDos' class variable any more.

**app/to-do/to-do.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';

import { ToDo } from '../models/ToDo';
import { ToDoService } from '../services/to-do.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css'],
  providers: [ToDoService]
})
export class ToDoComponent implements OnInit {

  onToDoAdded(toDo: {
    name: string,
    category: string
  }) {
    this.toDoService.addToDo(toDo.name, toDo.category);
  }

  constructor(private toDoService: ToDoService) { }

  ngOnInit() { }
}
```

With these changes, our application is still working as earlier but now it is little light weighted as we are using ToDoService as Data Service and get rid of custom property binding.

> Code till here is committed in branch v7.4.0

### Data Service for custom Event Binding.

Like custom property binding, we can also use Data Service for custom event binding. In our code, CreateComponent is emitting new event on click of button. Let's first update it.

**app/to-do/create/create.component.ts**

```typescript
import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ToDoService} from '../../services/to-do.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @ViewChild('name') nameInTS: ElementRef;
  @ViewChild('category') categoryInTS: ElementRef;

  // @Output() toDoAdded = new EventEmitter<{
  //   name: string,
  //   category: string
  // }>();
  //
  // constructor() { }
  constructor(private toDoService: ToDoService) { }

  ngOnInit() {
  }

  onAddToDo() {
    this.toDoService.addToDo(
      (<HTMLInputElement>this.nameInTS.nativeElement).value,
      (<HTMLInputElement>this.categoryInTS.nativeElement).value
    );
    // this.toDoAdded.emit({
    //   name: (<HTMLInputElement>this.nameInTS.nativeElement).value,
    //   category: (<HTMLInputElement>this.categoryInTS.nativeElement).value
    // });
  }
}
```

> Keeping commented code is not good. We kept it there just so that we can easily understand changes. Uncommented code will be removed in next version.

First change, we no longer need 'todoAdded' event emitter on line 13, so it is deleted (commented). However, we need ToDoService, we asked Angular to inject it in the constructor (line 19).

Further, onAddToDo method now do not need to emit event (Line 28-32) but it need to call addToDo method of ToDoService (Line 25-28).

Since CreateComponent is no longer emitting event, it can be removed in HTML as well

**app/to-do/to-do.component.html**

```html
<app-create>Add new ToDo</app-create>
<app-list>ToDo List</app-list>
```

With this, we now do not need 'onToDoAdded' method. Actually there is no code left in our ToDoComponent.

**app/to-do/to-do.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';

import { ToDo } from '../models/ToDo';
import { ToDoService } from '../services/to-do.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css'],
  providers: [ToDoService]
})
export class ToDoComponent implements OnInit {

  // onToDoAdded(toDo: {
  //   name: string,
  //   category: string
  // }) {
  //   this.toDoService.addToDo(toDo.name, toDo.category);
  // }

  // constructor(private toDoService: ToDoService) { }
  constructor() {}

  ngOnInit() { }
}
```

Still, ToDoComponent is doing one very important thing, it have providers array. It is instructing Angular to create one single instance of ToDoService for this (ToDoComponent) and all child components. This will make sure both CreateComponent and ListComponent are working on single instance of ToDoService.

> Code till here is committed in branch v7.4.1
