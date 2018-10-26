# Directives

Directives are the most basic building block of an Angular application.

Opps! Didn't we said same about components? Yes, we were right and we are right. Component is just an example of directive. Component is a directive with template.

Directives are used to extend the power of HTML attributes and shape(reshape) DOM's structure.

There are three type of directives:

- Component directive (or simply component) that we already discussed in last chapter.
- Attribute directives
- Structural directive

Let's first see some of the directives provided by angular.

## Attribute directives

Attribute directives, as name suggest, looks like normal HTML attribute. They only change (not add/remove) elements they are on but change their appearance or behavior.


## Structural directives.

Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements. They are easy to recognize as asterisk (*) precedes the directive attribute name. For example `*ngIf`, `*ngFor`.

## Attribute directive example

Let's see some attribute directives provided by Angular.

### ngClass

It can apply CSS classes to a HTML element. Example:

**app/to-do/list/list.component.css**

```css
.bold {
  font-weight: bold;
}
```

**app/to-do/list/list.component.html**

~~~ { .html .numberLines startFrom="16"}
      <tr *ngFor="let toDo of toDos;">
        <td><input type="checkbox" class="form-control" [checked]="toDo.done"></td>
        <td [ngClass]="toDo.done ? '' : 'bold'">{{ toDo.name }}</td>
        <td>{{ toDo.category }}</td>
        <td>
          <button class="btn btn-info mr-2">Edit</button>
          <button class="btn btn-danger">Delete</button>
        </td>
      </tr>
~~~

As you may check in line 18, we used `ngClass="bold"` and defined 'bold' class in CSS, only for ToDos which are not done. Now our incomplete ToDos are shown in bold text.

ngClass also support arrays `[ngClass]="['bold', 'red']"` and objects `[ngClass]="{bold: true, red:false}"` syntax, which makes it easy to control through Component class.

> Code till here is committed in branch `v6.3.1`

### ngStyle

Like ngClass, we can also use ngStyle to write styles without using CSS (If your company policy allows ;)

```typescript
@Component({
selector: 'app-style-example',
template: `
    <p
        [ngStyle]="{
            'color': 'red',
            'font-weight': 'bold',
            'borderBottom': borderStyle
        }">
            <ng-content></ng-content>
    </p>
`
})
export class StyleExampleComponent {
    borderStyle = '1px solid red';
}
```

## Structure directive example

Let's first check some structural directives provided by Angular.

### ngFor

We actually already seen the example of ngFor.

**app/to-do/list/list.component.html**

~~~ { .html .numberLines startFrom="16"}
      <tr *ngFor="let toDo of toDos;">
        <td><input type="checkbox" class="form-control" [checked]="toDo.done"></td>
        <td [ngClass]="toDo.done ? '' : 'bold'">{{ toDo.name }}</td>
        <td>{{ toDo.category }}</td>
        <td>
          <button class="btn btn-info mr-2">Edit</button>
          <button class="btn btn-danger">Delete</button>
        </td>
      </tr>
~~~

If you working in any programming language, it must be very easy for you to identify what line 16 is doing. It is repeating whole repeating 'tr' tag. Like 'foreach' loop in many languages, it create local variable 'toDo', which is single element of 'toDos' array. This loop is repeated for every single element of 'toDos'.

Now we understand what is 'ngFor'. It add 'tr' for every 'toDos' element. Note, with structure directive, angular is adding an element in the DOM. **But how Angular do it? Is asterisk (\*) there just representing structure directive?**

Well, Angular use [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)[^6.1] tag to define template and through JS they are added/removed from the DOM. While creating template, it use internal directive without asterisk. Thus, event though asterisk make it easy to identify type of directive, it is actually used by angular to render the templates.

### ngIf

As the name suggest, ngIf add the element to the DOM if condition is true. For example, let's assume we want to show delete button in our Todo List only if task in completed. We can do it as follow:

[^6.1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

**app/to-do/list/list.component.html**

~~~ { .html .numberLines startFrom="16"}
      <tr *ngFor="let toDo of toDos;">
        <td><input type="checkbox" class="form-control" [checked]="toDo.done"></td>
        <td [ngClass]="toDo.done ? '' : 'bold'">{{ toDo.name }}</td>
        <td>{{ toDo.category }}</td>
        <td>
          <button class="btn btn-info mr-2">Edit</button>
          <button class="btn btn-danger" *ngIf="toDo.done">Delete</button>
        </td>
      </tr>
~~~

As you may notice in line 22, `*ngIf="toDo.done"` is doing the trick. With this, out delete button will be added only if task is completed. Also note, if task is not done, button will not be hidden, it simple won't be present (added).

> Code till here is committed in branch `v6.4.2`.

### Using else part with ngIf

Since ngIf is directive, we need to define else condition in same directive. This can be done by using 'ng-template'.

Let's assume, if ToDo is not complete, we want to show text 'Finish ToDo'. We can do it as follow

**app/to-do/list/list.component.html**

~~~ { .html .numberLines startFrom="16"}
  <tr *ngFor="let toDo of toDos;">
    <td><input type="checkbox" class="form-control" [checked]="toDo.done"></td>
    <td [ngClass]="toDo.done ? '' : 'bold'">{{ toDo.name }}</td>
    <td>{{ toDo.category }}</td>
    <td>
      <button class="btn btn-info mr-2">Edit</button>
      <button class="btn btn-danger" *ngIf="toDo.done; else incompleteToDo">Delete</button>
      <ng-template #incompleteToDo>
        <span>Finish ToDo</span>
      </ng-template>
    </td>
  </tr>
~~~

> Code till here is committed in branch `v6.4.3`. However, ngIf & template added here will be removed in next version as we need delete button for every ToDo.
