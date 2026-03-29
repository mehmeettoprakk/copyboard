import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useClipboard } from '../../src/context/ClipboardContext';

export default function EditItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const itemId = Number(params.id);

  const { getItem, editItem } = useClipboard();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      const item = await getItem(itemId);
      if (!item) {
        Alert.alert('Kayit bulunamadi');
        router.back();
        return;
      }

      setTitle(item.title);
      setContent(item.content);
      setLoading(false);
    };

    void loadItem();
  }, [getItem, itemId, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Isim bos birakilamaz.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Metin bos birakilamaz.');
      return;
    }

    await editItem(itemId, title, content);
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white/70">Yukleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black px-4 py-2" edges={['top', 'bottom']}>
      <View className="mb-3 mt-1 flex-row items-start">
        <View className="w-1/3 items-start">
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="h-9 justify-center rounded-full border border-white/15 bg-white/10 px-3"
          >
            <Text className="text-sm font-bold text-white">Geri</Text>
          </Pressable>
        </View>

        <View className="w-1/3 items-center pt-0.5">
          <Text className="text-[22px] font-extrabold leading-6 text-white">Duzenle</Text>
          <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-white/50">
            kayit
          </Text>
        </View>

        <View className="w-1/3 items-end">
          <Pressable
            onPress={() => void handleSave()}
            hitSlop={10}
            className="h-9 justify-center rounded-full border border-cyan-500/40 bg-cyan-500 px-3"
          >
            <Text className="text-sm font-bold text-white">Kaydet</Text>
          </Pressable>
        </View>
      </View>

      <View className="rounded-3xl border border-white/10 bg-white/5 p-3">
        <Text className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-white/50">Isim</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Kayit ismi"
          placeholderTextColor="#9ca3af"
          className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm font-semibold text-white"
        />

        <Text className="mb-1 mt-3 text-[10px] font-bold uppercase tracking-[1px] text-white/50">Icerik</Text>
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Metin..."
          placeholderTextColor="#9ca3af"
          textAlignVertical="top"
          className="min-h-48 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-5 text-white"
        />

        <Text className="mt-2 text-right text-[10px] text-white/40">{content.length} karakter</Text>
      </View>
    </SafeAreaView>
  );
}
