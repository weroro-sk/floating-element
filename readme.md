# Vanilla JS Floating Element

`No jQuery needed :-)`

#### _Librabry for floating elements on page._

usage:

```javascript
import Floating from 'rs-floating';

const vanillaFloat = new Floating();
vanillaFloat.start(@selector, @options);

/*
@selector : ".className", "#id", element, nodeList
@options : object {
                    wrapper: string|HTMLElement (".className", "#id", element),
                    offsetBottom: number, 
                    offsetTop: number, 
                    fixedSelector: string, 
                    absoluteSelector: string, 
                    disableInlineStyles: boolean, 
                    disableClasses: boolean
                }
*/
```

### Types of usages:

```javascript
// Global constructor
const vanillaFloat = new Floating();
``` 
----

* Get floating element by className
* The wrapper will be detected automatically (parent element)
* Option offsetBottom has value 100px

```javascript
vanillaFloat.start('.floated-element-class-name', {offsetBottom: 100});
```

* Get floating element by id
* The wrapper will be selected by className
* Option offsetTop has value 150px

```javascript
vanillaFloat.start('#floated-element-id', {wrapper: '.wrapper-class-name', offsetTop: 150});
```

* Get floating element by className selected externally
* The wrapper will be detected automatically (parent element)
* Option disableInlineStyles has value true (library doesn't set inline styles for this element)

```javascript
const element = document.querySelector('.floated-element-class-name');

vanillaFloat.start(element, {disableInlineStyles: true});
```

* Get list of floating elements by tagName externally
* The wrapper for each item in list will be detected automatically (parent element)


```javascript
const elementsCollection = document.querySelectorAll('div');

vanillaFloat.start(elementsCollection);
```

* No input arguments needed
* The element will be detected automatically (previous sibling before script element)
* The wrapper of element will be detected automatically (parent element)


```
<div class="wrapper-class-name">
    <div class="floated-element-class-name">
        <!-- your content -->
    </div>
    <script>vanillaFloat.start()</script>
</div>
``` 


##CHANGELOG
> 1.0.2 - Memory and speed optimization