import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient colors={['#e0f2fe', '#eef2ff', '#f8fafc']} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center dark:bg-slate-950">
          <Text className="text-slate-500 dark:text-slate-300">Yukleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ecfeff', '#eff6ff', '#f8fafc']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 px-4 py-3" edges={['bottom']}>
        <View className="mb-4 rounded-3xl border border-cyan-100/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-cyan-700 dark:text-cyan-400">
            Kayit Duzenleme
          </Text>
          <Text className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">
            Isim ve icerik guncelle
          </Text>
        </View>

        <View className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/80">
          <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Isim
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Kayit ismi"
            placeholderTextColor="#94a3b8"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Icerik
          </Text>
          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Metin..."
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
            className="min-h-56 rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <Text className="mt-2 text-right text-xs text-slate-400 dark:text-slate-500">
            {content.length} karakter
          </Text>
        </View>

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 rounded-2xl border border-slate-300 bg-white py-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <Text className="text-center text-base font-bold text-slate-700 dark:text-slate-200">
              Vazgec
            </Text>
          </Pressable>
          <Pressable onPress={() => void handleSave()} className="flex-1 rounded-2xl bg-cyan-500 py-3">
            <Text className="text-center text-base font-bold text-white">Kaydet</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
