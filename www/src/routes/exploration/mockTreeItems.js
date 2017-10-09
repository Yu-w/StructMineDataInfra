export default [
  {
    depth: 0, // Used to style the list item. Items with 0 depth will not be rendered and act as the root parent
    children: [1, 5] // Indexes for child list items. If undefined, list item will be treated as leaf
  },
  {
    title: 'Tree in Dropdown',
    depth: 1,
    children: [2, 3, 4],
    parentIndex: 0,
  },
  {
    title: 'Tree',
    depth: 2,
    parentIndex: 1,
  },
  {
    title: 'Tree in',
    depth: 2,
    parentIndex: 1,
  },
  {
    title: 'Tree in Dropdown',
    depth: 2,
    children: [6],
    parentIndex: 1,
  },
  {
    title: 'Subtree lol',
    depth: 3,
    parentIndex: 4,
  },
  {
    title: 'Hello World',
    depth: 1,
    children: [7, 8],
    parentIndex: 0,
  },
  {
    title: 'Hello',
    depth: 2,
    parentIndex: 6,
  },
  {
    title: 'Hello World',
    depth: 2,
    parentIndex: 6,
  }
];
