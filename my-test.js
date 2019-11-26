      arrSplit(arr) {
        let refer = arr[0].stime,
          i = 0,
          tmpArr = [];
        for (let item of arr) {
          let differ = item.stime - refer;
          if (differ >= 300) {
            refer = item.stime;
            let differ = item.stime - refer;
            i++;
            console.log(refer)
          }

          if (tmpArr[i] == undefined) {
            tmpArr[i] = [];
          }

          tmpArr[i].push(item);
        }

        console.log(tmpArr)
      },




        // let dtime = Math.floor(new Date().getTime() / 1000);
        // let stime = Math.floor(new Date(time).getTime() / 1000);
        // if ((dtime - stime) <= 300) {
        //   return false;
        // }

        // if (idx > 0) {
        //   let records = this.$store.state.dialogue.chatModule.cahtRecords;
        //   let sendTime = Math.floor(new Date(records[idx - 1].send_time).getTime() / 1000);;
        //   if ((stime - sendTime) <= 180) {
        //     if (records.length == (idx + 1)) {
        //       return true;
        //     } else {
        //       return false;
        //     }
        //   }
        // }
