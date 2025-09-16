import {
  boolean,
  createRelations,
  createSchema,
  id,
  number,
  object,
  reference,
  string,
  timestamp,
} from "@repo/live-state";

const organization = object("organization", {
  id: id(),
  name: string(),
  slug: string(),
  createdAt: timestamp(),
});

const organizationUser = object("organizationUser", {
  id: id(),
  organizationId: reference("organization.id"),
  userId: reference("user.id"),
  enabled: boolean().default(true),
});

const thread = object("thread", {
  id: id(),
  organizationId: reference("organization.id"),
  name: string(),
  createdAt: timestamp(),
  discordChannelId: string().nullable(),
  status: number().default(0),
  priority: number().default(0),
  assignedUserId: reference("user.id").nullable(),
});

const message = object("message", {
  id: id(),
  threadId: reference("thread.id"),
  author: string(),
  content: string(),
  createdAt: timestamp(),
  origin: string().nullable(),
  externalMessageId: string().nullable(),
});

const user = object("user", {
  id: id(),
  name: string(),
  email: string(),
  emailVerified: boolean().default(false),
  image: string().nullable(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

const organizationRelations = createRelations(organization, ({ many }) => ({
  organizationUsers: many(organizationUser, "organizationId"),
  threads: many(thread, "organizationId"),
}));

const organizationUserRelations = createRelations(
  organizationUser,
  ({ one }) => ({
    organization: one(organization, "organizationId"),
    user: one(user, "userId"),
  })
);

const threadRelations = createRelations(thread, ({ one, many }) => ({
  organization: one(organization, "organizationId"),
  messages: many(message, "threadId"),
  assignedUser: one(user, "assignedUserId"),
}));

const messageRelations = createRelations(message, ({ one }) => ({
  thread: one(thread, "threadId"),
}));

export const schema = createSchema({
  // models
  organization,
  organizationUser,
  thread,
  message,
  user,
  // relations
  organizationUserRelations,
  organizationRelations,
  threadRelations,
  messageRelations,
});
