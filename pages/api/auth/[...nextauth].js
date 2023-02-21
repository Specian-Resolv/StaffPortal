import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Discord from 'discord.js'

const isUserAllowed = async (user) => {
  // Replace this with your own logic for checking if the user is allowed to access the site
  const allowedUsers = ['NP#8343']
  return allowedUsers.includes(`${user.username}#${user.discriminator}`)
}

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: "1077579657572012154",
      clientSecret: "0V8qY5eMXi0CKxChcg5bWTq7WDhxkEpX",
      scope: 'identify email',
      async profile(profile, tokens) {
        const client = new Discord.Client()
        await client.login(tokens.access_token)
        const user = await client.users.fetch(profile.id)
        const isAllowed = await isUserAllowed(user)
        if (!isAllowed) {
          return null
        }
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          image: user.avatarURL({ size: 64 })
        }
      }
    })
  ],
  session: {
    jwt: true
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
})
