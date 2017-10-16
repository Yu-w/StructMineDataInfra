export default [
  {
    depth: 0, // Used to style the list item. Items with 0 depth will not be rendered and act as the root parent
    children: [1]
  },
  {
    title: 'Anatomy', // category title
    depth: 1, // indicate depth level
    parentIndex: 0, // parent index
    children: [2], // children index
  },
  {
    title: 'Body Regions',
    depth: 2,
    parentIndex: 1,
    children: [3, 4],
  },
  {
    title: 'Anatomic Landmarks',
    depth: 3,
    parentIndex: 2,
  },
  {
    title: 'Breast',
    depth: 3,
    parentIndex: 2,
    children: [5, 6],
  },
  {
    title: 'Mammary Glands, Human',
    depth: 4,
    parentIndex: 4,
  },
  {
    title: 'Nipples',
    depth: 4,
    parentIndex: 4,
  },
  {
    title: 'Amputation Stumps',
    depth: 3,
    parentIndex: 2,
    children: [],
  }
];
