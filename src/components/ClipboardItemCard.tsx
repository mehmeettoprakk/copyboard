import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { ClipboardItem } from '../types/clipboard';

type Props = {
  item: ClipboardItem;
  index: number;
  copied: boolean;
  onCopy: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
};

const CARD_COLORS = ['#4b55a1', '#b63f2c', '#1c6cc2', '#cd8300', '#8f49bd', '#26a647'];

const Card = ({ item, index, copied, onCopy, onDelete, onEdit }: Props) => {
  const preview = item.content.length > 88 ? `${item.content.slice(0, 88)}...` : item.content;
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <Animated.View entering={FadeInDown.duration(180)} className="mb-2.5 flex-1">
      <Swipeable
        renderRightActions={() => (
          <RectButton
            onPress={onDelete}
            style={{
              backgroundColor: '#dc2626',
              justifyContent: 'center',
              alignItems: 'center',
              width: 96,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700', letterSpacing: 0.3 }}>Sil</Text>
          </RectButton>
        )}
      >
        <Pressable
          onPress={onCopy}
          style={{ backgroundColor: bgColor, opacity: copied ? 0.84 : 1 }}
          className="min-h-36 rounded-3xl px-3 py-3"
        >
          <View className="mb-2 flex-row items-start justify-between">
            <Text className="mr-2 flex-1 text-[24px] leading-none text-white/90">+</Text>
            <Pressable onPress={onEdit} hitSlop={10} className="rounded-full bg-black/20 px-2.5 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-wide text-white">Duzenle</Text>
            </Pressable>
          </View>

          <Text className="mb-1 text-[24px] font-extrabold leading-none text-white">~</Text>

          <View className="mt-auto">
            <Text className="text-[18px] font-extrabold text-white" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-white/95" numberOfLines={3}>
              {preview}
            </Text>
            <View className="mt-2.5 flex-row items-center justify-between">
              <Text className="text-[11px] font-semibold text-white/90">{formatDate(item.createdAt)}</Text>
              {copied ? (
                <Text className="text-[10px] font-bold uppercase tracking-wide text-white">Kopyalandi</Text>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

export const ClipboardItemCard = memo(Card);
