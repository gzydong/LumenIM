<template>
  <div class="calendar">
    <div class="calendar-tool">
      <p class="left">{{dateTimeStr}}</p>
      <p class="right">
        <span @click="handlePrevMonth">
          <el-tooltip class="item" content="上个月" placement="bottom" :visible-arrow="false">
            <i class="el-icon-arrow-left"></i>
          </el-tooltip>
        </span>
        <span @click="handleNextMonth">
          <el-tooltip class="item" content="下个月" placement="bottom" :visible-arrow="false">
            <i class="el-icon-arrow-right"></i>
          </el-tooltip>
        </span>
        <span @click="handleToday">今天</span>
      </p>
    </div>

    <ul class="calendar-items ">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="calendar-item week-item">{{item}}</li>
    </ul>
    <ul class="calendar-items" v-for="(items, index) in visibleCalendar">
      <li v-for="(item, index) in items" :key="index" class="calendar-item day-item"
        :class="{'todayBg':isCurrentDay(item.date),'month-class': !isCurrentMonth(item.date)}">
        <span>{{item.day}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  let utils = {
    getNewDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      return {
        year,
        month,
        day
      };
    },

    getDate(year, month, day) {
      return new Date(year, month, day);
    },

    formatDate(date) {
      date = Number(date);
      return date < 10 ? `0${date}` : date;
    }
  };

  export default {
    name: 'calendar',
    componentName: 'calendar',
    data() {
      let {
        year,
        month,
        day
      } = utils.getNewDate(new Date());
      return {
        calendarTitleArr: [
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '日'
        ],
        time: {
          year,
          month,
          day
        },
        calendarList: []
      }
    },
    computed: {
      dateTimeStr() {
        return `${this.time.year}年${this.time.month+1}月`;
      },
      visibleCalendar() {
        let calendatArr = [];
        let {
          year,
          month,
          day
        } = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));

        let currentFirstDay = utils.getDate(year, month, 1);

        // 获取当前月第一天星期几
        let weekDay = currentFirstDay.getDay();

        let startTime = currentFirstDay - (weekDay - 1) * 24 * 60 * 60 * 1000;

        let monthDayNum;
        if (weekDay == 5 || weekDay == 6) {
          monthDayNum = 42
        } else {
          monthDayNum = 35
        };

        for (let i = 0; i < monthDayNum; i++) {
          calendatArr.push({
            date: new Date(startTime + i * 24 * 60 * 60 * 1000),
            year: year,
            month: month + 1,
            day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
            clickDay: false,
          })
        };

        return this.chunk(calendatArr, 7)
      }
    },
    methods: {
      chunk(array, size) {
        let result = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }

        return result;
      },

      // 是否是当前月
      isCurrentMonth(date) {
        let {
          year: currentYear,
          month: currentMonth
        } = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
        let {
          year,
          month
        } = utils.getNewDate(date);
        return currentYear == year && currentMonth == month
      },
      // 是否是今天 
      isCurrentDay(date) {
        let {
          year: currentYear,
          month: currentMonth,
          day: currentDay
        } = utils.getNewDate(new Date());
        let {
          year,
          month,
          day
        } = utils.getNewDate(date);
        return currentYear == year && currentMonth == month && currentDay == day;
      },
      // 上一个月
      handlePrevMonth() {
        let prevMonth = utils.getDate(this.time.year, this.time.month, 1);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        this.time = utils.getNewDate(prevMonth);
        this.$emit('handlePrevMonth');
      },
      // 下一个月
      handleNextMonth() {
        let nextMonth = utils.getDate(this.time.year, this.time.month, 1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.time = utils.getNewDate(nextMonth);
        this.$emit('handleNextMonth');
      },
      // 点击回到今天
      handleToday() {
        this.time = utils.getNewDate(new Date());
        this.$emit('handleToday');
      }
    },
    created() {
      this.calendarList = this.visibleCalendar;
    }
  }

</script>
<style scoped>
  ul li {
    list-style: none;
  }

  .calendar {
    padding: 0;
    width: 100%;
    background: #F9FAFC;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    border-bottom: 1px solid #e0dfdf;
    padding-bottom: 10px;
  }

  .calendar-tool {
    height: 45px;
    line-height: 45px;
  }

  .calendar-tool p {
    display: inline-block;
    color: #1f2329;
    font-size: 13px;
    user-select: none;
  }

  .calendar-tool .left {
    float: left;
    padding-left: 10px;
    font-size: 14px;
  }

  .calendar-tool .right {
    float: right;
    color: #646a73;
  }

  .calendar-tool .right span {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }

  .calendar .calendar-items {
    width: 100%;
    border-right: none;
    display: flex;
  }

  .calendar .calendar-items .calendar-item {
    text-align: center;
    font-size: 13px;
    color: #424953;
    font-weight: 400;
    flex: 1;
    flex-direction: row;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
  }

  .calendar .calendar-items .week-item {
    font-weight: bold !important;
  }

  .calendar .calendar-items .day-item {
    cursor: pointer;
  }

  .calendar .calendar-items .day-item:hover,
  .calendar .calendar-items .todayBg {
    /* background-color: #409eff;
    color: white; */
    color: #409eff;
    font-size: 15px;
  }

  .calendar .calendar-items .month-class {
    color: #cccccc;
  }

</style>
