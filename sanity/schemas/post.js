export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "reviewedBy",
      title: "Reviewed By",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    },
    {
      name: "image",
      title: "Featured Image URL",
      type: "url",
    },
    {
      name: "draft",
      title: "Is Draft?",
      type: "boolean",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "callout",
          title: "Callout",
          fields: [
            { name: "type", type: "string" },
            { name: "title", type: "string" },
            { name: "text", type: "text" },
          ],
        },
        {
          type: "object",
          name: "disclaimer",
          title: "Disclaimer",
          fields: [{ name: "text", type: "text" }],
        },
        {
          type: "object",
          name: "offerCard",
          title: "Offer Card",
          fields: [{ name: "slug", type: "string" }],
        },
      ],
    },
  ],
}
