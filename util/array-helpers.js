// returns a new random array of specified length, and speciied max value (as in the value of each element of array)

function createRandomArray(length, max) {
  // length = length of array
  // max = max value of each element
  return Array(length)
    .fill() // .fill(no arg) - fills an array with specified length # of elements, which are all 0
    .map(() => Math.round(Math.random() * max));
}

//From https://stackoverflow.com/questions/9732624/how-to-swap-dom-child-nodes-in-javascript
function swapNodes(node1, node2) {
  const parent = node2.parentNode;
  const afterNode2 = node2.nextElementSibling;
  node1.replaceWith(node2); // replace node1 with node2
  parent.insertBefore(node1, afterNode2); // inserts node1 before afterNode2 (aka restore node1)
}

//The Element.nextElementSibling read-only property returns the element immediately following the specified one in its parent's children list, or null if the specified element is the last one in the list.

//insertBefore(newNode, referenceNode)
//The insertBefore() method of the Node interface inserts a node before a reference node as a child of a specified parent node.

// Element.replaceWith()
// The Element.replaceWith() method replaces this Element in the children list of its parent with a set of Node or string objects. String objects are inserted as equivalent Text nodes.

function swap(arr, idx1, idx2) {
  var temp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = temp;
}
