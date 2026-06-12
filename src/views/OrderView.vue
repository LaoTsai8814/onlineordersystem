<template>
  <div class="casino-container">
    <div class="slot-machine-housing">

      <div class="machine-header">
        <h1 class="neon-text">NEON SLOT</h1>
        <div class="status-badge" :class="{ 'win-flash': isWinAnimation }">
          {{ jackpotStatusText }}
        </div>
      </div>

      <div class="info-board">
        <div class="info-box">
          <span class="label">CREDIT</span>
          <span class="value gold-text">� {{ balance }}</span>
        </div>
        <div class="info-box">
          <span class="label">BET</span>
          <span class="value">� {{ betAmount }}</span>
        </div>
      </div>

      <div class="reels-window">
        <div class="laser-line"></div>

        <div class="reels-container">
          <div
            v-for="(reel, reelIndex) in reels"
            :key="reelIndex"
            class="reel-column"
          >
            <div
              class="strip"
              :style="getReelStyle(reelIndex)"
              @transitionend="handleTransitionEnd(reelIndex)"
            >
              <div
                v-for="(symbol, symIndex) in reel.displaySymbols"
                :key="symIndex"
                class="symbol-cell"
              >
                <svg class="slot-svg" viewBox="0 0 100 100" :style="{ '--glow-color': symbol.color }">
                  <g v-if="symbol.id === 'seven'" fill="#ff0055">
                    <path d="M20 20 h60 v15 L45 85 h-15 L55 35 h-35 Z" />
                  </g>
                  <g v-else-if="symbol.id === 'star'" fill="#ffd700">
                    <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
                  </g>
                  <g v-else-if="symbol.id === 'diamond'" fill="#00f2fe">
                    <polygon points="50,10 90,50 50,90 10,50" />
                  </g>
                  <g v-else-if="symbol.id === 'heart'" fill="#ff4757">
                    <path d="M12,30 A20,20 0 0,1 50,30 A20,20 0 0,1 88,30 Q88,60 50,85 Q12,60 12,30 Z" />
                  </g>
                  <g v-else-if="symbol.id === 'crown'" fill="#ff9f43">
                    <polygon points="10,80 90,80 85,35 65,55 50,20 35,55 15,35" />
                    <rect x="15" y="83" width="70" height="7" rx="3" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="control-panel">
        <div class="bet-adjuster">
          <button @click="adjustBet(-5)" :disabled="isSpinning || betAmount <= 5">-</button>
          <span class="bet-display">BET: {{ betAmount }}</span>
          <button @click="adjustBet(5)" :disabled="isSpinning || balance <= betAmount">+</button>
        </div>

        <button
          class="spin-button"
          :class="{ 'disabled': isSpinning || balance < betAmount, 'pulsing': !isSpinning }"
          @click="startSpin"
          :disabled="isSpinning || balance < betAmount"
        >
          {{ isSpinning ? 'SPINNING' : 'SPIN!' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

const balance = ref(1000);
const betAmount = ref(10);
const isSpinning = ref(false);
const isWinAnimation = ref(false);
const jackpotStatusText = ref('INSERT COIN');

// 基礎圖案池
const symbolPool = [
  { id: 'seven', color: '#ff0055' },
  { id: 'star', color: '#ffd700' },
  { id: 'diamond', color: '#00f2fe' },
  { id: 'heart', color: '#ff4757' },
  { id: 'crown', color: '#ff9f43' }
];

// 【關鍵改動 1】讓 displaySymbols 初始化包含更多圖案，甚至重複兩組，做成一個循環長帶
// 這樣我們就不需要在轉動時一直塞假資料，只要改變 translateY 即可
const reels = reactive([
  {
    displaySymbols: [...symbolPool, ...symbolPool, ...symbolPool,...symbolPool, ...symbolPool, ...symbolPool], // 5x3 = 15個圖案的固定長帶
    translateY: 0,
    isTransitioning: false,
    finalId: 'seven' // 紀錄最後停在中間的圖案 ID
  },
  {
    displaySymbols: [...symbolPool, ...symbolPool, ...symbolPool,...symbolPool, ...symbolPool, ...symbolPool],
    translateY: 0,
    isTransitioning: false,
    finalId: 'star'
  },
  {
    displaySymbols: [...symbolPool, ...symbolPool, ...symbolPool,...symbolPool, ...symbolPool, ...symbolPool],
    translateY: 0,
    isTransitioning: false,
    finalId: 'diamond'
  }
]);

const adjustBet = (amount) => {
  if (betAmount.value + amount > 0) betAmount.value += amount;
};

// 計算位移與過渡動畫
const getReelStyle = (index) => {
  // 【設定 1】：讓動畫時間變得更長！
  // 左邊輪子轉 5.5 秒、中間轉 6.2 秒、右邊輪子轉 7 秒
  const duration = 5.5 + index * 0.7;

  return {
    transform: `translateY(${reels[index].translateY}px)`,

    // 【設定 2】：換上黃金減速貝氏曲線 cubic-bezier(0.05, 0.7, 0.1, 1)
    // 這個參數的魔力在於：前 2 秒會以超越肉眼的速度狂飆，接下來的 4-5 秒會進入極度慢速的滑行定格狀態！
    transition: reels[index].isTransitioning
      ? `transform ${duration}s cubic-bezier(0.05, 0.7, 0.1, 1)`
      : 'none'
  };
};

const startSpin = async () => {
  if (isSpinning.value || balance.value < betAmount.value) return;

  isSpinning.value = true;
  isWinAnimation.value = false;
  jackpotStatusText.value = 'GOOD LUCK!';
  balance.value -= betAmount.value;

  // 用來記錄這一次三個滾輪各自抽到的真實結果 ID
  const finalResults = [];

  reels.forEach((reel, idx) => {
    // 【核心修改】：每個滾輪在被跑圈時，都獨立從 pool 裡面隨機抽一個圖案
    const randomSymbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
    finalResults.push(randomSymbol.id);

    reel.finalId = randomSymbol.id;

    // 尋找該圖案在長帶第二組的位置 (加上 5 是為了多跑一圈)
    const targetIndex = symbolPool.findIndex(s => s.id === randomSymbol.id) + 20;

    reel.isTransitioning = true;

    // 一格 90px，物理移動到該圖案。加上 idx 的延遲讓它有左到右依序停下的節奏感
    reel.translateY = -(targetIndex * 90);
  });

  // 判斷勝負邏輯：檢查陣列裡的三個 ID 是否完全相同
  const isWin = (finalResults[0] === finalResults[1] && finalResults[1] === finalResults[2]);
  let winAmount = 0;
  if (isWin) {
    winAmount = betAmount.value * 15;
  }

  // 等待 3 秒動畫完全定格後結算
  setTimeout(() => {
    isSpinning.value = false;

    if (isWin) {
      balance.value += winAmount;
      jackpotStatusText.value = `JACKPOT: +${winAmount}!`;
      isWinAnimation.value = true;
    } else {
      jackpotStatusText.value = balance.value <= 0 ? 'GAME OVER' : 'TRY AGAIN';
    }

    // 動態結束後，悄悄把位置重設回第一組，消除破綻
    reels.forEach((reel) => {
      reel.isTransitioning = false;
      const baseIndex = symbolPool.findIndex(s => s.id === reel.finalId);
      reel.translateY = -(baseIndex * 90);
    });

  }, 6400);
};

// 這次我們不需要這個監聽了，直接在 setTimeout 處理完畢
const handleTransitionEnd = (index) => {};
</script>

<style scoped>
/* 賽博朋克背景 */
.casino-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background: radial-gradient(circle, #1a052e 0%, #0c0214 100%);
  font-family: 'Impact', 'Arial Black', sans-serif;
  padding: 20px;
}

/* 機台外殼 */
.slot-machine-housing {
  background: linear-gradient(145deg, #12121a, #08080d);
  border: 4px solid #2d2d44;
  border-radius: 24px;
  padding: 25px;
  width: 360px;
  box-shadow: 0 0 40px rgba(0, 242, 254, 0.15), inset 0 0 20px rgba(255, 0, 128, 0.15);
}

.machine-header { text-align: center; margin-bottom: 20px; }
.neon-text {
  font-size: 2.4rem;
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #ff007f, 0 0 20px #ff007f;
  letter-spacing: 3px;
  margin: 0;
}
.status-badge {
  display: inline-block;
  background: #000;
  color: #00f2fe;
  border: 1px solid #00f2fe;
  padding: 4px 15px;
  font-size: 0.9rem;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
}
.win-flash {
  animation: flash 0.4s infinite alternate;
  color: #fff;
  background: #ff007f;
  box-shadow: 0 0 15px #ff007f;
}

/* 看板 */
.info-board { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 20px; }
.info-box {
  flex: 1;
  background: #030305;
  border: 2px solid #1b1b2a;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info-box .label { font-size: 0.75rem; color: #666680; margin-bottom: 4px; }
.info-box .value { font-size: 1.2rem; font-weight: bold; color: #fff; }
.gold-text { color: #ffd700 !important; }

/* 滾輪遮罩視窗 */
.reels-window {
  position: relative;
  height: 90px;
  background: #0a0a0f; /* 改為暗色背景，襯托發光 SVG */
  border-radius: 12px;
  border: 4px solid #151522;
  overflow: hidden;
  box-shadow: inset 0 8px 15px rgba(0,0,0,0.9);
  margin-bottom: 25px;
}

.laser-line {
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 242, 254, 0.4);
  box-shadow: 0 0 6px #00f2fe;
  z-index: 10;
}

.reels-container { display: flex; height: 100%; }
.reel-column { flex: 1; border-right: 2px solid #151522; position: relative; }
.reel-column:last-child { border-right: none; }
.strip { display: flex; flex-direction: column; }

/* SVG 圖案單元格與動態發光 */
.symbol-cell {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.slot-svg {
  width: 55px;
  height: 55px;
  /* 透過 CSS 變數動態讓內部的 SVG 圖案產生霓虹發光濾鏡 */
  filter: drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 12px var(--glow-color));
}

/* 控制台 */
.control-panel { display: flex; flex-direction: column; gap: 15px; }
.bet-adjuster { display: flex; justify-content: center; align-items: center; gap: 15px; }
.bet-adjuster button {
  background: #1b1b2a;
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
}
.bet-adjuster button:hover:not(:disabled) { background: #2d2d44; }
.bet-display { font-size: 1rem; color: #888; min-width: 80px; text-align: center; }

.spin-button {
  background: linear-gradient(to bottom, #ff007f, #b30059);
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(255, 0, 127, 0.4);
}
.spin-button:active:not(.disabled) { transform: scale(0.97); }
.spin-button.disabled { background: #2c2c35; box-shadow: none; cursor: not-allowed; color: #666; }

.pulsing { animation: pulse 1.5s infinite; }

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 127, 0.7); }
  75% { box-shadow: 0 0 0 12px rgba(255, 0, 127, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 127, 0); }
}
@keyframes flash { from { opacity: 0.4; } to { opacity: 1; } }
</style>