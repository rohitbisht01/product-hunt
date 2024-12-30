"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

interface ProductData {
  name: string;
  slug: string;
  headline: string;
  website: string;
  twitter: string;
  discord: string;
  description: string;
  logo: string;
  releaseDate: string;
  images: string[];
  category: string[];
  rank?: number;
}

// Create a product
export const createProduct = async ({
  name,
  slug,
  headline,
  website,
  twitter,
  discord,
  description,
  logo,
  releaseDate,
  images,
  category,
}: ProductData): Promise<any> => {
  try {
    const authenticatedUser = await auth();
    if (!authenticatedUser) {
      throw new Error("You must be signed in to create a product");
    }

    const userId = authenticatedUser.user?.id;
    const product = await prisma.product.create({
      data: {
        name,
        rank: 0,
        slug,
        headline,
        description,
        logo,
        releaseDate,
        website,
        twitter,
        discord,
        status: "PENDING",
        categories: {
          connectOrCreate: category.map((name) => ({
            where: {
              name,
            },
            create: {
              name,
            },
          })),
        },
        images: {
          createMany: {
            data: images.map((image) => ({ url: image })),
          },
        },

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Update a product
export const updateProduct = async (
  productId: string,
  {
    name,
    slug,
    headline,
    description,
    logo,
    releaseDate,
    website,
    twitter,
    discord,
    images,
  }: ProductData
) => {
  const authenticatedUser = await auth();
  if (!authenticatedUser) {
    throw new Error("You must be signed in to create a product");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      discord,
      images: {
        deleteMany: {
          productId,
        },
        createMany: {
          data: images.map((image) => ({ url: image })),
        },
      },
      status: "PENDING",
    },
  });
  return product;
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  const authenticatedUser = await auth();

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = authenticatedUser.user.id;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product || product.userId !== userId) {
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  return true;
};

// Get all owner products
export const getOwnerProducts = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    return [];
  }

  const userId = authenticatedUser.user?.id;

  const products = await prisma.product.findMany({
    where: {
      userId,
    },
  });

  return products;
};

// Check is the user has premium subscription
export const isUserPremium = async () => {
  const authenticatedUser = await auth();

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = authenticatedUser.user?.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.isPremium;
};

// Get Products by Id
export const getProductById = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        images: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRankById = async (): Promise<
  {
    id: string;
    name: string;
    upvotes: { id: string }[];
    rank: number;
  }[]
> => {
  // fetching products with their upvote counts
  const rankedProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      upvotes: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  // maxi number of upvotes among all products
  const maxUpvotes =
    rankedProducts.length > 0 ? rankedProducts[0].upvotes.length : 0;

  // assign ranks to each product based on their num of votes
  const productsWithRanks = rankedProducts.map((product, index) => ({
    ...product,
    rank: product.upvotes.length === maxUpvotes ? 1 : index + 2,
  }));

  return productsWithRanks;
};

// get products by userid
export const getProductsByUserId = async (userId: string) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
  });

  return products;
};

// my upvoted products
export const getUpvotedProducts = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const upvotedProducts = await prisma.upvote.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return upvotedProducts.map((upvote) => upvote.product);
  } catch (error) {
    console.error("Error getting upvoted products", error);
    return [];
  }
};

// get all categories
export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: {
          status: "ACTIVE",
        },
      },
    },
  });

  return categories;
};

export const getProductsByCategoryName = async (category: string) => {
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          name: category,
        },
      },
      status: "ACTIVE",
    },
  });

  return products;
};
