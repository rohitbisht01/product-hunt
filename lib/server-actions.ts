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

// Admin dashboard server actions
export const getUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

export const getPendingProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      categories: true,
      images: true,
      comments: true,
    },
  });

  return products;
};

export const getActiveProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
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
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  return products;
};

export const getRejectedProducts = async () => {};

export const getTotalUpvotes = async () => {
  const totalUpvotes = await prisma.upvote.count({
    where: {
      product: {
        status: "ACTIVE",
      },
    },
  });

  return totalUpvotes;
};

export const getAdminData = async () => {
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  const totalUpvotes = await prisma.upvote.count();
  const totalComments = await prisma.comment.count();
  const totalCategories = await prisma.category.count();

  return {
    totalProducts,
    totalUsers,
    totalUpvotes,
    totalComments,
    totalCategories,
  };
};

// Comments related server actions
export const commentOnProduct = async (
  productId: string,
  commentText: string
) => {
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

    // Check if authenticated user has a profile picture
    const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined

    const newComment = await prisma.comment.create({
      data: {
        body: commentText,
        profilePicture: profilePicture,
        createdAt: new Date(),
        userId,
        productId,
      },
      include: {
        user: true,
      },
    });

    const productDetails = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
        name: true,
      },
    });

    if (productDetails && productDetails.userId !== userId) {
      // notify the product owner about the comment
      await prisma.notification.create({
        data: {
          userId: productDetails.userId,
          body: `Commented on your product "${productDetails.name}"`,
          profilePicture: profilePicture,
          productId: productId,
          type: "COMMENT",
          status: "UNREAD",
          commentId: newComment.id,
        },
      });
    }
  } catch (error) {
    console.error("Error commenting on product:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting comment", error);
    throw error;
  }
};

// activate product and notify user
export const activateProduct = async (productId: string) => {
  try {
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
        status: "ACTIVE",
      },
    });

    await prisma.notification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been activated`,
        type: "ACTIVATED",
        status: "UNREAD",
        profilePicture: product.logo,
        productId: product.id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error activating product", error);
    return null;
  }
};

// reject product and notify user
export const rejectProduct = async (productId: string, reason: string) => {
  try {
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
        status: "REJECTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been reject. Reason: ${reason}`,
        type: "REJECTED",
        status: "UNREAD",
        profilePicture: `${product.logo}`,
        productId: product.id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error rejecting product", error);
    return null;
  }
};

// upvote product
export const upvoteProduct = async (productId: string) => {
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

    const upvote = await prisma.upvote.findFirst({
      where: {
        productId,
        userId,
      },
    });

    const profilePicture = authenticatedUser.user.image || "";
    if (upvote) {
      await prisma.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await prisma.upvote.create({
        data: {
          userId,
          productId,
        },
      });

      const productOwner = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          userId: true,
        },
      });

      if (productOwner && productOwner.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: productOwner.userId,
            body: `Upvoted your product`,
            profilePicture: profilePicture,
            productId: productId,
            type: "UPVOTE",
            status: "UNREAD",
          },
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error upvoting product", error);
    throw error;
  }
};

export const getNotifications = async () => {
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
    console.log(userId)
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (notifications.length === 0) {
      return null;
    }

    return notifications;
  } catch (error) {
    console.error("Error getting notifications", error);
    return [];
  }
};

// marking all notifications are read
export const markAllNotificationsAsRead = async () => {
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
    const notifications = await prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        status: "READ",
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read", error);
    throw error;
  }
};

// product by slug
export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: true,
        categories: true,
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
    console.error("Error getting product by slug:", error);
    return null;
  }
};

export const searchProducts = async (query: string) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      status: "ACTIVE",
    },
  });

  return products;
};
