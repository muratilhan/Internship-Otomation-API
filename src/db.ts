import { PrismaClient } from "@prisma/client";

const modelsWithIsDeleted = [
  "User",
  "InternForm",
  "InternStatus",
  "Interview",
  "Survey",
  "ConfidentalReport",
];

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async findMany({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        if (modelsWithIsDeleted.includes(model)) {
          args.where = { isDeleted: false, ...args.where };
        }

        return query(args);
      },
      async findFirst({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        if (modelsWithIsDeleted.includes(model)) {
          args.where = { isDeleted: false, ...args.where };
        }

        return query(args);
      },
      async findUnique({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        if (modelsWithIsDeleted.includes(model)) {
          args.where = { isDeleted: false, ...args.where };
        }

        return query(args);
      },
      async update({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        if (modelsWithIsDeleted.includes(model)) {
          args.where = { isDeleted: false, ...args.where };
        }

        return query(args);
      },
      async count({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        if (modelsWithIsDeleted.includes(model)) {
          args.where = { isDeleted: false, ...args.where };
        }

        return query(args);
      },
    },
  },
});

export default prisma;
