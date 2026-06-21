require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = "1518108813453033644";

const ROLES = {
  thirtyPlus: "1518105447406506096",
  twentyOnePlus: "1516960863607722094",
  loverBoy: "1518107136545001593",
  pillowPrincess: "1518105250320486511",
  loverGirl: "1518105311968231567",
  heartbreaker: "1518105368071241930",
  lgbtq: "1518105722213240892",
  messy: "1518106033422209186",
  crashout: "1518106112296095885",
  toxic: "1518106302726017054",
  erpDemon: "1518106372179497010"
};

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor("#5DA9FF")
      .setTitle("💙 Chiberia Self Roles")
      .setDescription(
`Select any roles you'd like from the dropdown below.

💗 Relationship Roles
🌈 Community Roles
🤭 Personality Roles

Your roles will automatically update whenever you make a selection.`
      )
      .setImage("https://cdn.discordapp.com/attachments/1236904936353304586/1518115737472991242/discordbanner_1.gif")
      .setFooter({
        text: "Chiberia RP"
      });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("roles")
      .setPlaceholder("✨ Select your roles")
      .setMinValues(0)
      .setMaxValues(11)
      .addOptions([
        {
          label: "30+",
          value: "thirtyPlus",
          emoji: "🛡️"
        },
        {
          label: "21+",
          value: "twentyOnePlus",
          emoji: "🔞"
        },
        {
          label: "Lover Boy",
          value: "loverBoy",
          emoji: "🖤"
        },
        {
          label: "Pillow Princess",
          value: "pillowPrincess",
          emoji: "🎀"
        },
        {
          label: "Lover Girl",
          value: "loverGirl",
          emoji: "💗"
        },
        {
          label: "Heartbreaker",
          value: "heartbreaker",
          emoji: "💔"
        },
        {
          label: "LGBTQ",
          value: "lgbtq",
          emoji: "🌈"
        },
        {
          label: "Messy",
          value: "messy",
          emoji: "🤭"
        },
        {
          label: "Crashout",
          value: "crashout",
          emoji: "🤯"
        },
        {
          label: "Toxic",
          value: "toxic",
          emoji: "😈"
        },
        {
          label: "ERP Demon",
          value: "erpDemon",
          emoji: "🔥"
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    // Check for existing role panel
    const messages = await channel.messages.fetch({ limit: 25 });

    const existingPanel = messages.find(
      msg =>
        msg.author.id === client.user.id &&
        msg.embeds.length > 0 &&
        msg.embeds[0].title === "💙 Chiberia Self Roles"
    );

    if (existingPanel) {
      console.log("Role panel already exists.");
      return;
    }

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("Role panel created.");
  } catch (err) {
    console.error(err);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "roles") return;

  try {
    const allRoleIds = Object.values(ROLES);

    const selectedRoleIds = interaction.values
      .map(value => ROLES[value])
      .filter(Boolean);

    const memberRoles = interaction.member.roles.cache;

    const rolesToRemove = memberRoles
      .filter(role => allRoleIds.includes(role.id))
      .filter(role => !selectedRoleIds.includes(role.id));

    if (rolesToRemove.size > 0) {
      await interaction.member.roles.remove(rolesToRemove);
    }

    if (selectedRoleIds.length > 0) {
      await interaction.member.roles.add(selectedRoleIds);
    }

    await interaction.reply({
      content: "✅ Your roles have been updated!",
      ephemeral: true
    });

  } catch (err) {
    console.error(err);

    await interaction.reply({
      content: "❌ There was an error updating your roles.",
      ephemeral: true
    });
  }
});

console.log("TOKEN EXISTS:", !!process.env.TOKEN);
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);

client.login(process.env.TOKEN);