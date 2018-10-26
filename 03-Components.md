# Components; Angular's basic building blocks

Components are the core of an Angular application. Every angular application have at least one component. Every component generally have 4 files:

- TypeScript file (name.component.ts)
    - This is a Type Script class with `@Component` decorator. It defines data and logic for the component
- HTML file (name.component.html)
    - Although having this it is not mandatory as we can define HTML template in component decorator as well, but generally component HTML have multiple lines, which we mostly prefer to define in separate HTML file.
- Styles file (name.component.css)
    - It is style sheet for component's HTML. Like HTML, can can define CSS also in component decorator, but in most cases, to separate different type of code in different files, we mostly define styles in separate css file.
- Tests (name.component.spec.ts)
    - This file contains test cases for the component. We will discuss how to write unit tests for angular application but for most of the training, we will concentrate to understand different angular features. Thus, until we discuss about unit tests, we will not use this file in any component.

## Creating a component

There are two ways to create new components:

1. Manually
2. Using Angular CLI

Let's check both of them one by one.

### Creating a component manually.

We already discussed that a component generally have 3 files; TypeScript class, HTML Template and CSS styles.

In out HelloWorldApp, lets create a new component to display 'Manual compoent'.

As we discussed in `Section 2.4 How our application works?`, a module bootstraps only one component and we already bootstraped 'AppComponent'. All other components, now should be called or loaded from AppComponent.

> Separate folder for each component: A complex angular application contains many components. Thus, as good a good coding practice, we should create separate folder for each component and they should follow hirarchical order. For example, if app component is going to load 'ManualComponent', it must be in 'app/manual' folder.

For this example, we are going to name our new componene as `ManualComponent`. Following coding best practices of angular, lets create folder `manual` in `app` folder. Then we need to create 3 files

**src/app/manual/manual.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent { }
```

As we discussed, Type Script is super set of Java Script. Like Java Script, if we include a TS file into another TS file, included TS file needs to export something. Thus, on line 8, we are exporting a class named `ManualComponent`. However, we need not to code anything right now so this class is empty.

From angular's point of view, to make this file as component, we need to define component decorator. Component is something provided by Angular, not Type Script. Thus, in first line, we are importing Component from angular core library. Once imported, we can use `@Component()` decorator on 'ManualComponent' class to tell angular this is a component.

A Component decorator needs three things (as JS object)

- selector
    - It tells angular how other components will refer this component. In other words, it define the tag which we can use in HTML. To avoid confusion with other HTML tags, as a coding best practice, we prefix our custom tags with something, mostly with `app-`. Thus, out selector is `app-manual`. However, you are free to choose any name, provided it is unique.
- templateUrl
    - It defines the template (HTML) for the component. As discussed earlier, in case we just have one or two line HTML, we can also define HTML directly here. In that case, we define template, instead of templateUrl. However, either 'template' or 'templateUrl' is mandatory.
- styleUrls
    - Please note, we have only one template but can have multiple style files for a component. Thus, it is styleUrls (Notice 's' at the end). Also, unlike template, it is and array, not string.
    - Like templateUrl, we can also replace styleUrls with styles. Any one of them is mandatory.

Lets also define manual.component.html, which is ideally just one line of code

```html
<p>Loaded from Manual Component</p>
```

Similarly, manual.component.css is also very simple style sheet

```css
p {
  color: red;
}
```

We defined the component but we are still not using it anywhere. Lets use our new tag in app.component.html

```html
<h1>
  Hello {{ title }}!
</h1>
<app-manual></app-manual>
```

Although it seems we are done, we have one final step remaining. Angular still do not know about our new component and will throw an errer as soon as it comes across `app-manual` tag in app component's html. To tell angular about our new component, we must update `app.module.ts` file.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManualComponent } from './manual/manual.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Here, we added line 5, where we are importing our new component. Still, just importing a Type Script file will not work. In line 10, we are actually declaring our new component. Declaration means, angular will not immediately load this new component but will read its component decorator and will know about new tag. As soon as we use new tag in any component (app.component.html in our case), angular will load (create instance of ManualCompoent) our component there.

With this, our application now loads our new component

![Manual Component](./images/03-Components/ManualComponent.png)

### Creating a component using Angular CLI.

It is good to understand how angular components works. However, once we understand it, instead of creating components manually, we can use angular CLI to actually create our components. This will  fast track component creation, as single command can create all the required files as well as make necessary changes in module.ts file.

> Angular CLI starts with `ng` command. We already saw `ng new` and `ng serve` commands. They both were Angular CLI commands.

Command to generare new component is `ng generate component <name>`. Angular CLI also comes with lot of short-cut command. Short cut command to generate component is `ng g c <name>`. Let's run `ng generate component cli` command to create new component 'CliComponent' through Angular CLI.

```bash
ng generate component cli
CREATE src/app/cli/cli.component.css (0 bytes)
CREATE src/app/cli/cli.component.html (22 bytes)
CREATE src/app/cli/cli.component.spec.ts (607 bytes)
CREATE src/app/cli/cli.component.ts (257 bytes)
UPDATE src/app/app.module.ts (466 bytes)
```

As we can see in output, it generated 4 files and updated app.module.ts file. Let's also update 'cli.component.html' and 'cli.component.css' to match our manual component style.

**cli.component.html**

```html
<p>Loaded from CLI Component</p>
```

**cli.component.css**

```css
p {
  color: blue;
}
```

We also need to add our selector 'app-cli' (auto generated, check in ts file) in 'app.component.html'

**app.component.css**

```html
<h1>
  Hello {{ title }}!
</h1>
<app-manual></app-manual>
<app-cli></app-cli>
```

Now our generated output is as follow

![Cli Component](./images/03-Components/CliComponent.png)

## Component stylesheet

In above image, we can see manual component is in red and cli component is in blue, exactly as we defined in our css.

However, if you were checking closely, you might be wondering that both components have `<p>` tag, then how angular manage to define separate styles for single tag. To understand this, lets use chrome's dev tools to check generated HTML code as shown in following image.

![Dev tools](./images/03-Components/DevTools.png)

As you might notice, `app-root` tag have a special attribute `_nghost-c0` and all the elements within it, including `app-manual` and `all-cli`, have attribute `_ngcontent-c0`. Here, `c0` is the name angular provided to `app-root`.

Similarly, `app-manual` and `app-cli` have attributes `_nghost-c1` and `nghost-c2` and all element within them (only 'p' tag) have attributes `_ngcontent-c1` and `_ngcontent-c2` respectively. Thus, angular provided them name as `c1` and `c2`.

This way, angular may identify different components. In the same image, 'p' tag under `app-manual` is selected and its styles are loaded on right hand side. Please note, angular have not generated generic style for `p` tag but for `p[_ngcontent-c1]` tag. In this way, angular makes sure the style we defined for an individual components, affets only that component. We will later learn how to define generic style that may be applied to all elements, regardless of component.

## Data Binding

Data binding is a way of communication between Type Script (Business Logic) and HTML Template (Presentation). There are four types of data binding in Angular.

|   | Data Binding         | Syntax                     | Direction   |
|---|----------------------|----------------------------|-------------|
| 1 | String Interpolation | {{ variableName }}         | TS -> HTML  |
| 2 | Property Binding     | [property]="data"          | TS -> HTML  |
| 3 | Event Binding        | (event)="expression"       | HTML -> TS  |
| 4 | Two-way Binding      | [(ngModel)]="variableName" | HMTL <-> TS |

### String interpolation

We already seen the example of string interpolation. We devined variable `title` in `app.component.ts` of our HelloWorldApp. Later, we displayed it in `app.component.html` using string interpolation `{{ title }}`.

As we can print variable in TS file to HTML file, in string interpolation, data flows from Type Script to HTML.

### Property Binding

Like String Interpolation, data flows from Type Script to HTML for Property Binding as well. However, here property means some HTML property like img's src propoerty, button's disabled property, etc. Thus, if we want to show value of some variable on HMTL page, use string interpolation. However, if you want to control property (or attribute) of some HTML element, Property binding is used.

> For both 'String Interpolation' and 'Property Binding' data flows from Type Script to HTML.
> 
> String Interpolation: Display valus of TS variable on DOM
> 
> Property Binding: Assign value of TS variable to HTML property

For example, let's set a new variable `name` in our app.component.ts.

**app.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HelloWorldApp';
  name = 'Kapil';
}
```

Now with `name` set, lets display it in HTML, but with property binding.

```html
<h1>
  Hello {{ title }}!
</h1>
<div>
  <span>Hello </span>
  <span [innerHtml]="name"></span>
</div>

<app-manual></app-manual>
<app-cli></app-cli>
```

On line 5, we could although use String Interpolation like `<span>{{ name }}</span>`, we used Property Binding to show the concept.

In above example, both String Interpolation and Property Binding could be used, we can select anyone based on our requirements.

> To understand properties and events of HTML, [MDN (Mozilla Developer Network) Web Docs](https://developer.mozilla.org/en-US/)[^3.1] is one of the best resources. Google is also developer's best friend. As an Angular developer, you need to manupulate HTML DOM a lot, thus understanding DOM, HTML elements and their properties and events is necessary. It is like vocabulary for Frontend developer. However, if you do not understand them right now, don't worry, understanding them is easy and with time and experience, you will be confortable. Just keep increasing your vocabulary.

[^3.1]: https://developer.mozilla.org/en-US/

### Event Binding

DOM regularly fire events based on user activity/input. Some example of events are:

- User moves mouse.
- Mouse enters/leaves an element (hover).
- Mouse (left/right/wheel) clicked.
- Key is pressed/down/up

As a forntend developer, we need to react on these events and this is where event binding is useful. As you can assume, user activity happens on HTML (contents visible to user) but code to react on these events is business logic, which is written in Type Script. Thus, event binding sends data from HMTL to Type Script.

For example of Event Binding, let's add a input box on our app component. Whenever user enters something there, default name 'Kapil' should change to the name entered by user.

**app.component.html**

```html
<h1>
  Hello {{ title }}!
</h1>
Enter your name <input type="text" (input)="onChange($event)" />
<div>
  <span>Hello </span>
  <span [innerHtml]="name"></span>
</div>

<app-manual></app-manual>
<app-cli></app-cli>
```

As you can notice on line 4, there is a input of type text. However, it also have `(input)="onChange($event)"`. This is event binding. One event on [`input type=text`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)[^3.2] tag is [`input`](https://developer.mozilla.org/en-US/docs/Web/Events/input)[^3.3].

[^3.2]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
[^3.3]: https://developer.mozilla.org/en-US/docs/Web/Events/input

We are binding input event. While binding event, we need to tell Angular what to do when this event is fired. We want to call a function `onChange` and we also want to pass event data. Event data can be passed with special reserved variable `$event`. Angular creates that variable whenever an event happens. Now, we can handle this event on Type Script as follow.

**app.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HelloWorldApp';
  name = 'Kapil';

  onChange(event: KeyboardEvent) {
    this.name = (<HTMLInputElement>event.target).value;
  }
}
```

We added `onChange` function in Type Script between line 12-14.

> Few notes about Type Script and Type Script functions:
> 
> - Type Script allow to define types of variable, that is, unlike Java Script, it can act as 'strictly typed language'. That's how it got its name.
> - To define the type of a variable, syntax is `variableName: type`.
> - In Type Script, we can define functions by writing function name, followed by () for optional parameters and {} for function body.
> - Type Script can also define return type.
> - Complete Syntax:
> 
> ```typescript
> functionName(parameterOne: Type, parameterTwo: type): returnType { 
>   // function body;
> }
> ```
>
> - If we need to refer any variable of other function defined in calss, we can do this using `this.` keywork. This should be clear if you worked with any object oriented programming language. Unfortunately, OOPs is out of scope for this course. (PS: I'm planning OOP video as well. Keep checking my [YouTube channel](http://bit.ly/kapilyoutube)[^3.4]; Sorry for self-promotion but couldn't resist ;)

[^3.4]: http://bit.ly/kapilyoutube

`onChange` function is one line fucntion, which is crystal clear, we are assigning value of our input tag to variable name. However, looking at syntax, you may have following questions:

- How can I know event is of type 'KeyboardEvent'?
- What is HTMLInputElement?
- What is (<HTMLInputElement>event.target)?
- From where should I learn all these alien looking syntax?

Valid questions, specially if you didn't have much experience with Java Script. You will learn all of them with time and experience but I have few suggestions here, which could help you to self identify thing.

Let's replace `onChange` function as follow and check the output in console (select developer tools in chrome and open `console` tab)

```typescript
onChange(event: Event) {
    console.log(event.constructor.name);
    console.log(event.target.constructor.name);
    console.log((<HTMLInputElement>event.target).value);
    this.name = (<HTMLInputElement>event.target).value;
}
```

Here, we added 3 `console.log` statements. It is java script syntax to log some value through JS. These logs can be seen in console of browser. Console outout should be like (Assuming you pressed 'K'):

```bash
InputEvent
HTMLInputElement
K
```

If you have an object in java script, you can get it's class name but adding '`.constructor.name`' to the object. Thus, first log will tell us name of class of `event`, which is InputEvent, you can use it to write type of parameter.

Now (missing in code) you can do `console.log(event)` to inspect different properties of 'event' object. You will notice, it have a property 'target' which is again on object. When you extract 'target' you will find data entered in text box against `value` property.

Still, `this.name = event.target.value;` will not work. You will get error 'value is not property of InputElement'. Here, second console statement `console.log(event.target.constructor.name);` will help you. It will tell us `event.target` is an object of `HTMLInputElement` class but our error mentioned 'InputElement'. Thus, we specifically need to tell Angular that `event.target` is an object of `HTMLInputElement`.

We can cast (change) object by syntax `<castTo>object`. Thus, `<HTMLInputElement>event.target` will convert `target` to object of `HTMLInputelement`. Please note () for this whole syntax as we want to call `value` on casted object. Now `(<HTMLInputElement>event.target).value` must not looked like alien code and you should be able to solve similar problem in future.

Once you solve the problem, don't forget to remove `console.log` statements.

Now with these changes, our application looks as follow:

![Event Binding](./images/03-Components/EventBinding.png)

Here, left image shows default value of name and right image shows changes when we enter the name.

### Two way binding

As the name suggest, two way binding synchronize data both Type Script to HMTL and vice versa. Syntax for two way binding is `[(ngModel)]="variableName"`.

Let's see example of Two-Way binding. In our Hello world app, let's also include a text box for age and change text to 'Hello Nane, you are x years old'.

**app.comoponent.html**

```html
<h1>
  Hello {{ title }}!
</h1>
<p>Enter your name <input type="text" (input)="onChange($event)" /></p>
<p>Enter your age <input type="text" [(ngModel)]="age" /></p>
<div>
  <span>Hello </span>
  <span [innerHtml]="name"></span>.
  <span>You are {{ age }} years old.</span>
</div>

<app-manual></app-manual>
<app-cli></app-cli>
```

On line 5, we added a new test and input box. On inout box, we have `[(ngModel)]=age`. Here, as we will see, age is a variable in Type Script that we are alss displaying on Line 9.

**app.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HelloWorldApp';
  name = 'Kapil';
  age = 0;

  onChange(event: KeyboardEvent) {
    this.name = (<HTMLInputElement>event.target).value;
  }
}
```

Here, on line 11, we introduced new variable, and initialized it by '0'. When we reload our form, we can note '0' is prepopulated in out new input field. But wait, if you try to reload now, you will get an error.

`ngModel` is a functionality not available in angular core but it is provided by Forms module of angular. Thus, before we can use two way binding, we must inport forms module.

**app.module.ts**

~~~ { .typescript .numberLines startFrom="1"}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ManualComponent } from './manual/manual.component';
import { CliComponent } from './cli/cli.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualComponent,
    CliComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
~~~

Here, we are importing FromsModule from angular forms on line 3. As we discussed, import is type script feature, and angular will not know about it until we add it under 'imports' attay. We did that in line 17 above. Now our page will looks like follow with age prepopulated and it will also change the text as soon as we change in age text box.

![Two Way Binding](./images/03-Components/TwoWayBinding.png)

We are progressing well but now it is time to go little more advanced and Hello world application is not sufficient for it. You might have noticed that we were able to demonstrate the concept of databinding in hello world app, it do not makes lot of sense.

Thus, let's create a new application, that we will develop while we learn angular. Before we continue remaining topics of components, lets discuss requirements of our course project. Later, whatever new topics we learn, we will immediately apply to our course project. 
