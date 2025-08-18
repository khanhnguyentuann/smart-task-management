export const REACTION_EMOJIS = ['👍', '❤️', '😮', '😄', '🎉', '👏', '🔥', '💯', '🤔', '😢'] as const

export type ReactionEmoji = typeof REACTION_EMOJIS[number]

export const REACTION_EMOJI_LABELS: Record<ReactionEmoji, string> = {
    '👍': 'Thumbs up',
    '❤️': 'Heart',
    '😮': 'Surprised',
    '😄': 'Happy',
    '🎉': 'Party',
    '👏': 'Clap',
    '🔥': 'Fire',
    '💯': '100',
    '🤔': 'Thinking',
    '😢': 'Sad'
}
