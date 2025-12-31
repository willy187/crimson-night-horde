import { useMemo } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'zh';

const translations = {
  ko: {
    // Start Screen
    subtitle: '끝없는 적들로부터 살아남아라',
    startGame: '게임 시작',
    fullscreenInfo: '전체화면으로 실행됩니다',
    controls: '조작법',
    movement: '이동',
    pause: '일시정지',
    sound: '사운드',
    touchControls: '화면 터치로 조이스틱 조작',
    autoAttack: '자동으로 가장 가까운 적을 공격합니다',
    
    // Game HUD
    level: 'Lv',
    time: '시간',
    kills: '처치',
    damage: '공격력',
    projectiles: '발사체',
    
    // Game Over Screen
    finalScore: '최종 점수',
    survivalTime: '생존 시간',
    killCount: '처치 수',
    levelReached: '달성 레벨',
    restart: '다시 시작',
    minutes: '분',
    seconds: '초',
    
    // Leaderboard
    leaderboard: '🏆 리더보드',
    loading: '불러오는 중...',
    noRecords: '아직 기록이 없습니다',
    
    // Initial Input
    topTenEntry: '🏆 TOP 10 진입!',
    rankScore: '{rank}위 - {score}점',
    enterInitials: '이니셜을 입력하세요 (최대 5자)',
    register: '등록',
    skip: '건너뛰기',
    
    // Level Up
    levelUp: 'LEVEL UP!',
    selectUpgrade: '업그레이드를 선택하세요',
    
    // Rotate Device
    rotateDevice: '기기를 가로로 회전해주세요',
    landscapeOnly: '이 게임은 가로 모드에서만 플레이할 수 있습니다',
  },
  en: {
    subtitle: 'Survive the endless horde',
    startGame: 'Start Game',
    fullscreenInfo: 'Runs in fullscreen mode',
    controls: 'Controls',
    movement: 'Move',
    pause: 'Pause',
    sound: 'Sound',
    touchControls: 'Touch screen to use joystick',
    autoAttack: 'Automatically attacks the nearest enemy',
    
    level: 'Lv',
    time: 'Time',
    kills: 'Kills',
    damage: 'Damage',
    projectiles: 'Projectiles',
    
    finalScore: 'Final Score',
    survivalTime: 'Survival Time',
    killCount: 'Kills',
    levelReached: 'Level Reached',
    restart: 'Restart',
    minutes: 'm',
    seconds: 's',
    
    leaderboard: '🏆 Leaderboard',
    loading: 'Loading...',
    noRecords: 'No records yet',
    
    topTenEntry: '🏆 TOP 10!',
    rankScore: 'Rank {rank} - {score} pts',
    enterInitials: 'Enter your initials (max 5)',
    register: 'Submit',
    skip: 'Skip',
    
    levelUp: 'LEVEL UP!',
    selectUpgrade: 'Choose an upgrade',
    
    rotateDevice: 'Please rotate your device',
    landscapeOnly: 'This game can only be played in landscape mode',
  },
  ja: {
    subtitle: '終わりなき敵から生き延びろ',
    startGame: 'ゲーム開始',
    fullscreenInfo: 'フルスクリーンで実行されます',
    controls: '操作方法',
    movement: '移動',
    pause: 'ポーズ',
    sound: 'サウンド',
    touchControls: '画面タッチでジョイスティック操作',
    autoAttack: '最も近い敵を自動で攻撃します',
    
    level: 'Lv',
    time: '時間',
    kills: '討伐',
    damage: '攻撃力',
    projectiles: '弾数',
    
    finalScore: '最終スコア',
    survivalTime: '生存時間',
    killCount: '討伐数',
    levelReached: '到達レベル',
    restart: 'リスタート',
    minutes: '分',
    seconds: '秒',
    
    leaderboard: '🏆 リーダーボード',
    loading: '読み込み中...',
    noRecords: 'まだ記録がありません',
    
    topTenEntry: '🏆 TOP 10入り!',
    rankScore: '{rank}位 - {score}点',
    enterInitials: 'イニシャルを入力 (最大5文字)',
    register: '登録',
    skip: 'スキップ',
    
    levelUp: 'LEVEL UP!',
    selectUpgrade: 'アップグレードを選択',
    
    rotateDevice: 'デバイスを横向きにしてください',
    landscapeOnly: 'このゲームは横向きでのみプレイできます',
  },
  zh: {
    subtitle: '在无尽的敌群中生存下来',
    startGame: '开始游戏',
    fullscreenInfo: '将以全屏模式运行',
    controls: '操作说明',
    movement: '移动',
    pause: '暂停',
    sound: '声音',
    touchControls: '触摸屏幕操作摇杆',
    autoAttack: '自动攻击最近的敌人',
    
    level: 'Lv',
    time: '时间',
    kills: '击杀',
    damage: '攻击力',
    projectiles: '弹数',
    
    finalScore: '最终得分',
    survivalTime: '生存时间',
    killCount: '击杀数',
    levelReached: '达到等级',
    restart: '重新开始',
    minutes: '分',
    seconds: '秒',
    
    leaderboard: '🏆 排行榜',
    loading: '加载中...',
    noRecords: '暂无记录',
    
    topTenEntry: '🏆 进入TOP 10!',
    rankScore: '第{rank}名 - {score}分',
    enterInitials: '请输入昵称 (最多5字)',
    register: '提交',
    skip: '跳过',
    
    levelUp: 'LEVEL UP!',
    selectUpgrade: '选择升级',
    
    rotateDevice: '请将设备横置',
    landscapeOnly: '本游戏仅支持横屏模式',
  },
};

export type TranslationKey = keyof typeof translations.ko;

const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('zh')) return 'zh';
  return 'en'; // Default to English
};

export const useI18n = () => {
  const language = useMemo(() => detectLanguage(), []);
  
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };
  
  return { t, language };
};
