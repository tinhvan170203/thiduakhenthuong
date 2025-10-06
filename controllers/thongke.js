const Canbos = require("../models/Canbo");
const Chidoans = require("../models/Chidoans");
const Dois = require("../models/Dois");
const Donvis = require("../models/Donvis");
const Khenthuongcanhan = require("../models/Khenthuongcanhan");
const Khenthuongtapthe = require("../models/Khenthuongtapthe");
const Kiluatcanhan = require("../models/Kiluatcanhan");
const KhenthuongtaptheCapdoi = require("../models/Khenthuongtapthecapdoi");
const HistoriesSystem = require("../models/HistoriesSystem");
const Users = require("../models/Users");
const _ = require('lodash');
const Danhhieuthiduas = require("../models/Danhhieuthiduas");
const Joi = require('joi');

const DanhhieuthiduasCapdois = require("../models/DanhhieuthiduasCapdoi");
module.exports = {
  //khen thuong ca nhan dang cong tac tai don vi
  getKhenthuongs: async (req, res) => {
    let { soQD, nguoiky,
      donvi, doi, noidung,
      hinhthuc, capkhen, tungay, denngay, theloai } //thể loại là tập thể hay cá nhân hay tất cả
      = req.query;

    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-01-01"
    };


    // kiểm tra xem đang chọn tất cả đơn vị hay là chỉ 1 đơn vị cụ thể
    let checked_all_donvi = donvi.value === "";
    let data_tapthe = [];
    let data_canhan = [];

    // kiểm tra xem có lấy ra tất cả các đội hay chỉ lấy của phòng thì có 2 trường hợp
    // 1 là chọn đơn vị ở trường dơn vị, 2 là chọn đơn vị trong trường tập thể với giá trị là 1 đơn vị
    try {
      if (checked_all_donvi && doi.value === "") { // TH chọn tất cả đơn vị cũng như tất cả ở trưởngf tập thể được khen
        //lay ra khen thuong tat ca cac phong
        // cần check xem loại khen thưởng là tất cả hay tập thể hay là cá nhân

        if (theloai === "") {
          let donvis = await Users.find({ vaitro: "Quản trị thông thường" }).sort({ thutu: -1 });
          let donvis_id_list = donvis.map(i => i._id.toString());

          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: { $in: donvis_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          let dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            donvi: { $in: dois_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_doi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tendoi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          //khen cá nhân tất cả
          let khenthuongs_of_canhan = await Khenthuongcanhan.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            }
          }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');
          // console.log(khenthuongs_of_canhan)

          khenthuongs_of_canhan = khenthuongs_of_canhan.filter(e => e.canhanduockhenthuong.nghihuu === false && e.canhanduockhenthuong.chuyencongtacngoaitinh === false);

          for (let khenthuong of khenthuongs_of_canhan) {
            data_canhan.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.canhanduockhenthuong.hoten,
              id_canhan: khenthuong.canhanduockhenthuong._id
            })
          };

        } else if (theloai === "Tập thể") {
          let donvis = await Users.find({ vaitro: "Quản trị thông thường" }).sort({ thutu: -1 });
          let donvis_id_list = donvis.map(i => i._id.toString());

          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: { $in: donvis_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          let dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            donvi: { $in: dois_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_doi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tendoi,
              id_tapthe: khenthuong.tapthe._id
            })
          };
        } else { // TH lấy ra tất cả các khen thưởng cá nhân
          let khenthuongs_of_canhan = await Khenthuongcanhan.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
          }).populate('hinhthuc').populate('capkhen').populate('canhanduockhenthuong');

          khenthuongs_of_canhan = khenthuongs_of_canhan.filter(e => e.canhanduockhenthuong.nghihuu === false && e.canhanduockhenthuong.chuyencongtacngoaitinh === false);

          for (let khenthuong of khenthuongs_of_canhan) {
            data_canhan.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.canhanduockhenthuong.hoten,
              id_canhan: khenthuong.canhanduockhenthuong._id
            })
          };
        };

      } else if (checked_all_donvi && doi.value !== "") { //TH chọn giá trị tại trường tập thể là 1 giá trị cụ thể
        // cần check xem giá trị đó là tập thể cấp phòng hay là tập thể cấp tổ, đội
        let check_cap_donvi = doi.value === doi.donvi;

        if (check_cap_donvi) { //TH chọn tập thể là đơn vị cấp phòng thif chi lay cua cap phong

          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: doi.donvi
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

        } else {  // TH tập thể được khen chọn là cấp tổ đội , thì sẽ dựa trên loại là khen thưởng tập thể hay cá nhân
          if (theloai === "") {
            let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              tapthe: doi.value
            }).populate('tapthe').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_doi) {
              data_tapthe.push({
                soQD: khenthuong.soQD,
                ngayky: khenthuong.ngayky,
                noidung: khenthuong.noidung,
                soQD: khenthuong.soQD,
                hinhthuc: khenthuong.hinhthuc,
                capkhen: khenthuong.capkhen,
                doituongkhen: khenthuong.tapthe.tendoi,
                id_tapthe: khenthuong.tapthe._id
              })
            };

            // đối với khen thưởng cá nhân cần check xem ngày được khen thưởng có đang công tác tại đội k
            // console.log('123')
            let canhan_tung_congtac_taidoi = await Canbos.find({
              'donvi.donvi': doi.value,
              nghihuu: false,
              chuyencongtacngoaitinh: false
            }).populate('donvi.donvi');
            // console.log('456')
            for (let canbo of canhan_tung_congtac_taidoi) {
              let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
                soQD: { $regex: soQD, $options: "i" },
                nguoiky: { $regex: nguoiky, $options: "i" },
                noidung: { $regex: noidung, $options: "i" },
                ngayky: {
                  $gte: tungay,
                  $lte: denngay,
                },
                canhanduockhenthuong: canbo._id
              }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');



              for (let khenthuong of khenthuongs_of_canhan_condition_date) {
                let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
                let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);
                // console.log('sss', arr_checked)
                if (arr_checked.length === 0) continue;
                let checked = arr_checked[0].donviString.includes(doi.value);
                if (checked) {
                  data_canhan.push({
                    soQD: khenthuong.soQD,
                    ngayky: khenthuong.ngayky,
                    noidung: khenthuong.noidung,
                    nguoiky: khenthuong.nguoiky,
                    soQD: khenthuong.soQD,
                    hinhthuc: khenthuong.hinhthuc,
                    capkhen: khenthuong.capkhen,
                    doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                    id_canhan: khenthuong.canhanduockhenthuong._id
                  })
                }
              };
            }

          } else if (theloai === "Tập thể") {
            let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              tapthe: doi.value
            }).populate('tapthe').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_doi) {
              data_tapthe.push({
                soQD: khenthuong.soQD,
                ngayky: khenthuong.ngayky,
                noidung: khenthuong.noidung,
                soQD: khenthuong.soQD,
                hinhthuc: khenthuong.hinhthuc,
                capkhen: khenthuong.capkhen,
                doituongkhen: khenthuong.tapthe.tendoi,
                id_tapthe: khenthuong.tapthe._id
              })
            };
          } else {
            // đối với khen thưởng cá nhân cần check xem ngày được khen thưởng có đang công tác tại đội k
            let canhan_tung_congtac_taidoi = await Canbos.find({
              'donvi.donvi': doi.value,
              nghihuu: false,
              chuyencongtacngoaitinh: false
            }).populate('donvi.donvi');

            for (let canbo of canhan_tung_congtac_taidoi) {
              let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
                soQD: { $regex: soQD, $options: "i" },
                nguoiky: { $regex: nguoiky, $options: "i" },
                noidung: { $regex: noidung, $options: "i" },
                ngayky: {
                  $gte: tungay,
                  $lte: denngay,
                },
                canhanduockhenthuong: canbo._id
              }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');

              for (let khenthuong of khenthuongs_of_canhan_condition_date) {
                let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
                let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);
                if (arr_checked.length === 0) continue;
                let checked = arr_checked[0].donviString.includes(doi.value);
                if (checked) {
                  data_canhan.push({
                    soQD: khenthuong.soQD,
                    ngayky: khenthuong.ngayky,
                    noidung: khenthuong.noidung,
                    nguoiky: khenthuong.nguoiky,
                    soQD: khenthuong.soQD,
                    hinhthuc: khenthuong.hinhthuc,
                    capkhen: khenthuong.capkhen,
                    doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                    id_canhan: khenthuong.canhanduockhenthuong._id
                  })
                }
              };
            }
          }
        }
      } else if (!checked_all_donvi && doi.value === "") {
        // TH chọn 1 đơn vị cụ thể tại trường đơn vị và chọn tất cả ở trường tập thể được khen
        if (theloai === "") {
          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: donvi.value
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          let dois = await Dois.find({ donvi: donvi.value }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: { $in: dois_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_doi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tendoi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          // đối với khen thưởng cá nhân cần check xem ngày được khen thưởng có đang công tác tại đội k
          let canhan_tung_congtac_taidoi = await Canbos.find({
            'donvi.donvi': { $in: dois_id_list },
            nghihuu: false,
            chuyencongtacngoaitinh: false
          }).populate('donvi.donvi');

          for (let canbo of canhan_tung_congtac_taidoi) {
            let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              canhanduockhenthuong: canbo._id
            }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_canhan_condition_date) {
              let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
              let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);

              if (arr_checked.length === 0) continue;
              let checked = arr_checked[0].donviString.includes(doi.value);
              // console.log('checked', checked)
              if (checked) {
                data_canhan.push({
                  soQD: khenthuong.soQD,
                  ngayky: khenthuong.ngayky,
                  noidung: khenthuong.noidung,
                  soQD: khenthuong.soQD,
                  hinhthuc: khenthuong.hinhthuc,
                  capkhen: khenthuong.capkhen,
                  doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                  id_canhan: khenthuong.canhanduockhenthuong._id
                })
              }
            };
          }

        } else if (theloai === "Tập thể") {
          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: donvi.value
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

          let dois = await Dois.find({ donvi: donvi.value }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: { $in: dois_id_list }
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_doi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tendoi,
              id_tapthe: khenthuong.tapthe._id
            })
          };
        } else { // chỉ lấy cá nhân
          let dois = await Dois.find({ donvi: donvi.value }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let canhan_tung_congtac_taidoi = await Canbos.find({
            'donvi.donvi': { $in: dois_id_list },
            nghihuu: false,
            chuyencongtacngoaitinh: false
          }).populate('donvi.donvi');

          for (let canbo of canhan_tung_congtac_taidoi) {
            let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              canhanduockhenthuong: canbo._id
            }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_canhan_condition_date) {
              let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
              let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);
              if (arr_checked.length === 0) continue;
              let checked = arr_checked[0].donviString.includes(doi.value);
              if (checked) {
                data_canhan.push({
                  soQD: khenthuong.soQD,
                  ngayky: khenthuong.ngayky,
                  noidung: khenthuong.noidung,
                  soQD: khenthuong.soQD,
                  hinhthuc: khenthuong.hinhthuc,
                  capkhen: khenthuong.capkhen,
                  doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                  id_canhan: khenthuong.canhanduockhenthuong._id
                })
              }
            };
          }
        }
      } else if (!checked_all_donvi && doi.value !== "") { //TH chọn đơn vị cụ thể và đội khác tất cả thì cũng cần chec
        let check_cap_donvi = doi.value === doi.donvi;
        if (check_cap_donvi) { //TH chọn tập thể là đơn vị cấp phòng
          let khenthuongs_of_donvi = await Khenthuongtapthe.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            tapthe: doi.donvi
          }).populate('tapthe').populate('hinhthuc').populate('capkhen');

          for (let khenthuong of khenthuongs_of_donvi) {
            data_tapthe.push({
              soQD: khenthuong.soQD,
              ngayky: khenthuong.ngayky,
              noidung: khenthuong.noidung,
              soQD: khenthuong.soQD,
              hinhthuc: khenthuong.hinhthuc,
              capkhen: khenthuong.capkhen,
              nguoiky: khenthuong.nguoiky,
              doituongkhen: khenthuong.tapthe.tenhienthi,
              id_tapthe: khenthuong.tapthe._id
            })
          };

        } else {  // TH tập thể được khen chọn là cấp tổ đội
          if (theloai === "") {
            let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              tapthe: doi.value
            }).populate('tapthe').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_doi) {
              data_tapthe.push({
                soQD: khenthuong.soQD,
                ngayky: khenthuong.ngayky,
                nguoiky: khenthuong.nguoiky,
                noidung: khenthuong.noidung,
                soQD: khenthuong.soQD,
                hinhthuc: khenthuong.hinhthuc,
                capkhen: khenthuong.capkhen,
                doituongkhen: khenthuong.tapthe.tendoi,
                id_tapthe: khenthuong.tapthe._id
              })
            };

            // đối với khen thưởng cá nhân cần check xem ngày được khen thưởng có đang công tác tại đội k
            let canhan_tung_congtac_taidoi = await Canbos.find({
              'donvi.donvi': doi.value,
              nghihuu: false,
              chuyencongtacngoaitinh: false
            }).populate('donvi.donvi');

            for (let canbo of canhan_tung_congtac_taidoi) {
              let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
                soQD: { $regex: soQD, $options: "i" },
                nguoiky: { $regex: nguoiky, $options: "i" },
                noidung: { $regex: noidung, $options: "i" },
                ngayky: {
                  $gte: tungay,
                  $lte: denngay,
                },
                canhanduockhenthuong: canbo._id
              }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');

              for (let khenthuong of khenthuongs_of_canhan_condition_date) {
                let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
                let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);
                if (arr_checked.length === 0) continue;
                let checked = arr_checked[0].donviString.includes(doi.value);
                if (checked) {
                  data_canhan.push({
                    soQD: khenthuong.soQD,
                    ngayky: khenthuong.ngayky,
                    noidung: khenthuong.noidung,
                    nguoiky: khenthuong.nguoiky,
                    soQD: khenthuong.soQD,
                    hinhthuc: khenthuong.hinhthuc,
                    capkhen: khenthuong.capkhen,
                    doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                    id_canhan: khenthuong.canhanduockhenthuong._id
                  })
                }
              };
            }
          } else if (theloai === "Tập thể") {
            let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              tapthe: doi.value
            }).populate('tapthe').populate('hinhthuc').populate('capkhen');

            for (let khenthuong of khenthuongs_of_doi) {
              data_tapthe.push({
                soQD: khenthuong.soQD,
                ngayky: khenthuong.ngayky,
                nguoiky: khenthuong.nguoiky,
                noidung: khenthuong.noidung,
                soQD: khenthuong.soQD,
                hinhthuc: khenthuong.hinhthuc,
                capkhen: khenthuong.capkhen,
                doituongkhen: khenthuong.tapthe.tendoi,
                id_tapthe: khenthuong.tapthe._id
              })
            };
          } else {
            // đối với khen thưởng cá nhân cần check xem ngày được khen thưởng có đang công tác tại đội k
            let canhan_tung_congtac_taidoi = await Canbos.find({
              'donvi.donvi': doi.value,
              nghihuu: false,
              chuyencongtacngoaitinh: false
            }).populate('donvi.donvi');

            for (let canbo of canhan_tung_congtac_taidoi) {
              let khenthuongs_of_canhan_condition_date = await Khenthuongcanhan.find({
                soQD: { $regex: soQD, $options: "i" },
                nguoiky: { $regex: nguoiky, $options: "i" },
                noidung: { $regex: noidung, $options: "i" },
                ngayky: {
                  $gte: tungay,
                  $lte: denngay,
                },
                canhanduockhenthuong: canbo._id
              }).populate('canhanduockhenthuong').populate('hinhthuc').populate('capkhen');

              for (let khenthuong of khenthuongs_of_canhan_condition_date) {
                let timeNumberNgayky = new Date(khenthuong.ngayky).getTime();
                let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);
                if (arr_checked.length === 0) continue;
                let checked = arr_checked[0].donviString.includes(doi.value);
                if (checked) {
                  data_canhan.push({
                    soQD: khenthuong.soQD,
                    ngayky: khenthuong.ngayky,
                    noidung: khenthuong.noidung,
                    nguoiky: khenthuong.nguoiky,
                    soQD: khenthuong.soQD,
                    hinhthuc: khenthuong.hinhthuc,
                    capkhen: khenthuong.capkhen,
                    doituongkhen: khenthuong.canhanduockhenthuong.hoten,
                    id_canhan: khenthuong.canhanduockhenthuong._id
                  })
                }
              };
            }
          }

        }

      };

      // Tạo một Map để đếm số lượt xuất hiện của từng phần tử dựa trên key là kết hợp doituongkhen + id_tapthe
      const countMap = new Map();

      data_tapthe.forEach(item => {
        const key = `${item.doituongkhen}-${item.id_tapthe}`;
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMap
      const arrTapthe = Array.from(countMap, ([key, soluotkhen]) => {
        const [doituongkhen, id_tapthe] = key.split('-');
        return {
          doituongkhen,
          id_tapthe,
          soluotkhen
        };
      });

      const countMapCanhan = new Map();
      data_canhan.forEach(item => {
        const key = `${item.doituongkhen}-${item.id_canhan}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const arrCanhan = Array.from(countMapCanhan, ([key, soluotkhen]) => {
        const [doituongkhen, id_canhan] = key.split('-');
        return {
          doituongkhen,
          id_canhan,
          soluotkhen
        };
      });

      let data = data_tapthe.concat(data_canhan);

      data.filter(i => i.hinhthuc.hinhthuckhen.includes(hinhthuc) && i.capkhen.capkhen.includes(capkhen))
        .sort((a, b) => {
          let x = new Date(b.ngayky).getTime()
          let y = new Date(a.ngayky).getTime()
          return x - y
        })

      res.status(200).json({ data, taptheduockhen: arrTapthe, canhanduockhen: arrCanhan, message: "Tìm kiếm khen thưởng thành công" });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },
  getKiluats: async (req, res) => {
    let { soQD, nguoiky,
      donvi, noidung,
      hinhthuc, tungay, denngay, vaitro } //thể loại là tập thể hay cá nhân hay tất cả
      = req.query;

    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-01-01"
    };

    let data_canhan = [];
    let checked_user_donvi = vaitro === "Quản trị thông thường";
    // console.log(checked_user_donvi)
    try {

      if (checked_user_donvi) { //kiểm tra TH này là tài khoản quản trị thông thường
        let dois = await Dois.find({ donvi: req.userId.userId }).sort({ thutu: -1 });
        let dois_id_list = dois.map(i => i._id.toString());

        let canhan_tung_congtac_taidoi = await Canbos.find({
          'donvi.donvi': { $in: dois_id_list }
        }).populate('donvi.donvi');

        for (let canbo of canhan_tung_congtac_taidoi) {
          let kiluats_of_canhan_condition_date = await Kiluatcanhan.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            hinhthuc: { $regex: hinhthuc, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            },
            canhanbikiluat: canbo._id
          }).populate('canhanbikiluat');

          for (let kiluat of kiluats_of_canhan_condition_date) {
            let timeNumberNgayky = new Date(kiluat.ngayky).getTime();
            let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);

            if (arr_checked.length === 0) continue;
            let checked = dois_id_list.includes(arr_checked[0].donviString);
            // console.log('checked', checked)
            if (checked) {
              data_canhan.push({
                soQD: kiluat.soQD,
                ngayky: kiluat.ngayky,
                nguoiky: kiluat.nguoiky,
                noidung: kiluat.noidung,
                hinhthuc: kiluat.hinhthuc,
                soQD: kiluat.soQD,
                doituongkhen: kiluat.canhanbikiluat.hoten,
                id_canhan: kiluat.canhanbikiluat._id
              })
            }
          };
        }
      } else {
        if (donvi === "") {// TH tìm kiếm tất cả trong db === vai trò quản trị hệ thống và theo dõi thi đua
          let kiluats_of_canhan_condition_date = await Kiluatcanhan.find({
            soQD: { $regex: soQD, $options: "i" },
            nguoiky: { $regex: nguoiky, $options: "i" },
            noidung: { $regex: noidung, $options: "i" },
            hinhthuc: { $regex: hinhthuc, $options: "i" },
            ngayky: {
              $gte: tungay,
              $lte: denngay,
            }
          }).populate('canhanbikiluat');

          for (let kiluat of kiluats_of_canhan_condition_date) {
            data_canhan.push({
              soQD: kiluat.soQD,
              ngayky: kiluat.ngayky,
              nguoiky: kiluat.nguoiky,
              noidung: kiluat.noidung,
              hinhthuc: kiluat.hinhthuc,
              soQD: kiluat.soQD,
              doituongkhen: kiluat.canhanbikiluat.hoten,
              id_canhan: kiluat.canhanbikiluat._id
            })
          };
        } else {
          let dois = await Dois.find({ donvi }).sort({ thutu: -1 });
          let dois_id_list = dois.map(i => i._id.toString());

          let canhan_tung_congtac_taidoi = await Canbos.find({
            'donvi.donvi': { $in: dois_id_list }
          }).populate('donvi.donvi');

          for (let canbo of canhan_tung_congtac_taidoi) {
            let kiluats_of_canhan_condition_date = await Kiluatcanhan.find({
              soQD: { $regex: soQD, $options: "i" },
              nguoiky: { $regex: nguoiky, $options: "i" },
              noidung: { $regex: noidung, $options: "i" },
              hinhthuc: { $regex: hinhthuc, $options: "i" },
              ngayky: {
                $gte: tungay,
                $lte: denngay,
              },
              canhanbikiluat: canbo._id
            }).populate('canhanbikiluat');

            for (let kiluat of kiluats_of_canhan_condition_date) {
              let timeNumberNgayky = new Date(kiluat.ngayky).getTime();
              let arr_checked = canbo.donvi.filter(i => i.timeNumber <= timeNumberNgayky).sort((a, b) => b.timeNumber - a.timeNumber);

              if (arr_checked.length === 0) continue;
              let checked = dois_id_list.includes(arr_checked[0].donviString);
              // console.log('checked', checked)
              if (checked) {
                data_canhan.push({
                  soQD: kiluat.soQD,
                  ngayky: kiluat.ngayky,
                  nguoiky: kiluat.nguoiky,
                  noidung: kiluat.noidung,
                  hinhthuc: kiluat.hinhthuc,
                  soQD: kiluat.soQD,
                  doituongkhen: kiluat.canhanbikiluat.hoten,
                  id_canhan: kiluat.canhanbikiluat._id
                })
              }
            };
          }
        }
      };

      const countMapCanhan = new Map();
      data_canhan.forEach(item => {
        const key = `${item.doituongkhen}-${item.id_canhan}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const arrCanhan = Array.from(countMapCanhan, ([key, soluotkhen]) => {
        const [doituongkhen, id_canhan] = key.split('-');
        return {
          doituongkhen,
          id_canhan,
          soluotkhen
        };
      });

      // console.log(data_canhan)
      res.status(200).json({ data: data_canhan, canhanbikiluats: arrCanhan, message: "Tìm kiếm các quyết định kỉ luật thành công" });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: "Có lỗi xảy ra!!! Vui lòng liên hệ quản trị viên",
      });
    }
  },

  getThiduathangsTheoNam: async (req, res) => {
    let { nam, donvi, vaitro } = req.query;
    let toTimeNumber = new Date(`${nam}-12-31`).getTime();
    let goTimeNumber = new Date(`${nam}-01-01`).getTime();
    let ngaycuoinam = `${nam}-12-31`;
    // console.log(`${nam - 0o1 - 0o1}`)
    let checked_user_donvi = vaitro === "Quản trị thông thường";
    let data = [];

    let dois = [];
    let dois_id_list = [];
    try {
      if (checked_user_donvi) {
        // console.log('1')
        dois = await Dois.find({ donvi: req.userId.userId }).sort({ thutu: -1 });
        dois_id_list = dois.map(i => i._id.toString());
      } else {
        if (donvi === "") {
          // console.log('2')
          let donvis = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true }).sort({ thutu: -1 });
          let donvis_id_list = donvis.map(i => i._id.toString());

          dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        } else {
          // console.log(3)
          dois = await Dois.find({ donvi: donvi }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        }
      };

      let data_not_red = [] // co xanh, vang
      let data_not_value = [] // danh sach can boọ chưa cập nhật đầy đủ thi đua tháng
      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: "active",
        chuyencongtacngoaitinh: false,
        nghihuu: false
        // ngaynghihuu: { $lte: ngaycuoinam }
      }).populate({
        path: "donvi",
        populate: {
          path: "donvi", populate: {
            path: 'donvi'
          }
        }
      });
      // console.log(canhan_tung_congtac_taidoi.length)
      // console.log(canhan_tung_congtac_taidoi[0].donvi[0])
      let totalCanbo = 0;
      let total_flag_blue = 0;
      let total_flag_yellow = 0;

      let donvis_dang_congtac = [];

      for (let canbo of canhan_tung_congtac_taidoi) {
        let findWithTimeNumber = canbo.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);
        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        if (!checked) continue;
        totalCanbo += 1;
        // console.log(findWithTimeNumber[findWithTimeNumber.length - 1].donvi.donvi.tentaikhoan)
        let thiduathang = canbo.thiduathang.filter(e => {
          let compare = new Date(e.thoigian).getTime();
          return goTimeNumber <= compare && toTimeNumber >= compare
        });

        let blue = 0; // tính tổng số cờ xanh trong khoảng thời gian của 1 cán bộ
        let yellow = 0;
        let red = 0;
        let not_value = 0;
        let thoigians_blue = [];
        let thoigians_yellow = [];
        let thoigians_not_value = [];

        //vòng lặp 12 tháng trong năm để lấy ra xếp loại từng tháng
        let resultThiduathang = [];
        for (let month = 1; month <= 12; month++) {
          let check_nghihuu = (new Date(canbo.ngaynghihuu)).getTime();
          // console.log(check_nghihuu)
          let time_check_month = (new Date(`${nam}-` + `${String("0" + month).slice(-2)}-15`)).getTime()
          if (check_nghihuu > time_check_month) continue;

          let index = thiduathang.findIndex(item => item.thoigian === `${nam}-` + `${String("0" + month).slice(-2)}-15`);
          if (index === -1) { // TH chưa có thi đua tháng trong năm đó

            resultThiduathang.push({
              [`thang${month}`]: {
                result: "null",
                ghichu: "",
                thoigian: `${nam}-` + `${String("0" + month).slice(-2)}-15`
              }
            });

            not_value += 1;
            thoigians_not_value.push(`${nam}-` + `${String("0" + month).slice(-2)}-15`);

          } else {
            resultThiduathang.push({ [`thang${month}`]: thiduathang[index] });
            if (thiduathang[index].result === "blue") {
              blue += 1;
              thoigians_blue.push(thiduathang[index].thoigian)
            } else if (thiduathang[index].result === "yellow") {
              yellow += 1;
              thoigians_yellow.push(thiduathang[index].thoigian)
            } else if (thiduathang[index].result === "red") {
              red += 1;
            }
          };
        };
        // console.log(resultThiduathang)
        data.push({
          _id: canbo._id,
          hoten: canbo.hoten,
          ngaysinh: canbo.ngaysinh,
          donvidangcongtac: `${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi} - ${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.donvi.tentaikhoan}`,
          id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
          resultThiduathang
        });

        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });

        if (blue > 0 || yellow > 0) {
          data_not_red.push({
            hoten: canbo.hoten,
            _id: canbo._id,
            blue,
            donvidangcongtac: `${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi} - ${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.donvi.tentaikhoan}`,
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            thoigians_blue,
            yellow,
            thoigians_yellow
          })
        };
      };

      let data_thidua_red_month_of_year = [];
      let data_thidua_blue_month_of_year = [];
      let data_thidua_yellow_month_of_year = [];
      let data_thidua_not_value_month_of_year = [];
      for (let month = 1; month <= 12; month++) {
        let total_red_of_month = 0;
        let total_blue_of_month = 0;
        let total_yellow_of_month = 0;
        let total_not_value_of_month = 0;
        data.forEach(thidua => {
          let index = thidua.resultThiduathang.findIndex(item => item[`thang${month}`] && item[`thang${month}`].thoigian === `${nam}-` + `${String("0" + month).slice(-2)}-15`);
          if (index === -1) return;

          if (thidua.resultThiduathang[index][`thang${month}`].result === "red") {
            total_red_of_month += 1;
          } else if (thidua.resultThiduathang[index][`thang${month}`].result === "blue") {
            total_blue_of_month += 1;
            total_flag_blue += 1;
          } else if (thidua.resultThiduathang[index][`thang${month}`].result === "yellow") {
            total_yellow_of_month += 1;
            total_flag_yellow += 1;
          } else {
            total_not_value_of_month += 1;
          }
        });
        data_thidua_red_month_of_year.push(total_red_of_month);
        data_thidua_blue_month_of_year.push(total_blue_of_month);
        data_thidua_yellow_month_of_year.push(total_yellow_of_month);
        data_thidua_not_value_month_of_year.push(total_not_value_of_month);
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });

      res.status(200).json({
        data, data_not_red, totalCanbo, data_not_value,
        data_thidua_red_month_of_year, data_thidua_blue_month_of_year, data_thidua_yellow_month_of_year,
        data_thidua_not_value_month_of_year, total_flag_blue, total_flag_yellow, list_doi_option
      });

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },


  // hàm láy kết quả thi đua tháng của cán bộ, chiến sĩ trong khoảng thời gian
  getThiduathangs: async (req, res) => {
    let { tungay, denngay, donvis } = req.query;
    // đơn vị là danh sách id các đơn vị
    // console.log(req.query)
    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-01-01"
    };

    let toTimeNumber = new Date(denngay).getTime();
    let goTimeNumber = new Date(tungay).getTime();

    try {
      let dois = await Dois.find({ donvi: { $in: donvis } });
      let dois_id_list = dois.map(i => i._id.toString());
      let data_not_red = [] // co xanh, vang
      let data_not_value = [] // danh sach can boọ chưa cập nhật đầy đủ thi đua tháng

      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: { $ne: "delete" }
      }).populate({
        path: "donvi",
        populate: {
          path: "donvi", populate: {
            path: 'donvi'
          }
        }
      });;

      let totalCanbo = 0;
      let total_flag_blue = 0;
      let total_flag_yellow = 0;

      let donvis_dang_congtac = [];
      for (let canbo of canhan_tung_congtac_taidoi) {
        // console.log(canbo.donvi)
        let findWithTimeNumber = canbo.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);
        // console.log(findWithTimeNumber)
        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        // console.log(checked)
        if (!checked) continue;
        totalCanbo += 1;

        let thiduathang = canbo.thiduathang.filter(e => {
          let compare = new Date(e.thoigian).getTime();
          return goTimeNumber <= compare && toTimeNumber >= compare
        });

        let blue = 0; // tính tổng số cờ xanh trong khoảng thời gian của 1 cán bộ
        let yellow = 0;
        let thoigians_blue = [];
        let thoigians_yellow = [];

        thiduathang.forEach(i => {
          if (i.result === "blue") {
            blue += 1;
            total_flag_blue += 1;
            thoigians_blue.push(i.thoigian);
          } else if (i.result === "yellow") {
            yellow += 1;
            total_flag_yellow += 1;
            thoigians_yellow.push(i.thoigian);
          }
        })

        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });

        if (blue > 0 || yellow > 0) {
          data_not_red.push({
            hoten: canbo.hoten,
            _id: canbo._id,
            blue,
            donvidangcongtac: `${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi} - ${findWithTimeNumber[findWithTimeNumber.length - 1].donvi.donvi.tentaikhoan}`,
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            thoigians_blue,
            yellow,
            thoigians_yellow
          })
        };
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });

      res.status(200).json({
        data_not_red, totalCanbo, data_not_value,
        total_flag_blue, total_flag_yellow, list_doi_option
      })

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  getBangtheodoiThiduathang: async (req, res) => {
    let { year, chidoans } = req.query;


    let toTimeNumber = new Date(year + `-12-31`).getTime();
    let fromTimeNumber = new Date(year + `-01-01`).getTime();
    try {
      let donvis = []; // danh sách các đơn vị thuộc chi đoàn cần tím kiếm
      if (chidoans === "") {
        let userId = req.userId.userId;

        const user = await Users.findOne({ _id: userId }).populate('quantrinhomchidoan').populate('quantrinhomchidoan.nhomdonvithuocchidoan');
        //kiểm tra xem đơn vị nào active thì lấy ra tránh trường hợp đơn vị đã xác nhập rồi nhưng vẫn thêm vào 
        //gây ra tình trạng k đúng theo thực tế
        let chidoans = user.quantrinhomchidoan;

        for (let e of chidoans) {
          donvis = donvis.concat(e.nhomdonvithuocchidoan)
          donvis = _.uniqWith(donvis, _.isEqual); // loại bỏ các phần tử giống nhau
        };
      } else {
        let chidoan = await Chidoans.findById(chidoans).populate('nhomdonvithuocchidoan')
        donvis = chidoan.nhomdonvithuocchidoan;
      };
      // console.log(donvis)
      let data = []; //result return frontend
      for (let donvi of donvis) {
        let doanvienOfDonvi = await Canbos.find({
          "donvi.donviString": donvi._id,
          "donvi.timeNumber": {
            $lte: toTimeNumber
          },
          trangthai: "active",
          chuyencongtacngoaitinh: false
        }, { hoten: 1, donvi: 1, ngaysinh: 1, thiduathang: 1 }).populate('donvi.donvi');

        for (let i of doanvienOfDonvi) {
          let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => b.timeNumber - a.timeNumber);
          let checked = findWithTimeNumber[findWithTimeNumber.length - 1].donviString === donvi._id.toString();
          if (!checked) return;

          let thiduathang = i.thiduathang.filter(e => {
            let compare = new Date(e.thoigian).getTime();
            return fromTimeNumber <= compare && toTimeNumber >= compare
          });
          //vòng lặp 12 tháng trong năm để lấy ra xếp loại từng tháng
          let resultThiduathang = [];
          for (let month = 1; month <= 12; month++) {
            let index = thiduathang.findIndex(item => item.thoigian === `${year}-` + `${String("0" + month).slice(-2)}-15`);
            if (index === -1) { // TH chưa có thi đua tháng trong năm đó
              resultThiduathang.push({
                [`thang${month}`]: {
                  result: "null",
                  ghichu: ""
                }
              });
            } else {
              resultThiduathang.push({ [`thang${month}`]: thiduathang[index] })
            }
          };

          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            resultThiduathang
          });
        };
      };
      // console.log('123')
      res.status(200).json(data)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  // lấy ra dữ liệu các đảng viên hiện đang công tác tại đơn vị tính đến năm đang chọn
  getThiduanams: async (req, res) => {
    let { nam, donvi, vaitro } = req.query;
    // console.log('123')
    let toTimeNumber = new Date(`${nam}-12-31`).getTime();
    // let goTimeNumber = new Date(`${nam}-01-01`).getTime();
    let ngaycuoinam = `${nam}-12-31`;
    // console.log(`${nam - 0o1 - 0o1}`)
    let checked_user_donvi = vaitro === "Quản trị thông thường";
    let data = [];

    let dois = [];
    let dois_id_list = [];
    try {
      //tìm kiếm đoàn viên tính đến thời điểm đến ngày
      if (checked_user_donvi) {
        // console.log('1')
        dois = await Dois.find({ donvi: req.userId.userId }).sort({ thutu: -1 });
        dois_id_list = dois.map(i => i._id.toString());
      } else {
        if (donvi === "") {
          // console.log('2')
          let donvis = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true }).sort({ thutu: -1 });
          let donvis_id_list = donvis.map(i => i._id.toString());

          dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        } else {
          // console.log(3)
          dois = await Dois.find({ donvi: donvi }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        }
      };

      let donvis_dang_congtac = [];
      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: "active",
        chuyencongtacngoaitinh: false,
        ngaynghihuu: { $lte: ngaycuoinam }
      }).populate('donvi.donvi');
      // console.log(canhan_tung_congtac_taidoi)
      let totalCanbo = 0;
      let total_htxsnv = 0;
      let total_httnv = 0;
      let total_htnv = 0;
      let total_khtnv = 0;
      let total_not_value = 0;
      for (let i of canhan_tung_congtac_taidoi) {
        let check_nghihuu = (new Date(i.ngaynghihuu)).getTime();
        if (check_nghihuu > toTimeNumber) continue;

        let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);

        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        if (!checked) continue;

        totalCanbo += 1;
        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });
        let findYear = i.thiduanam.find(e => e.thoigian.includes(nam));

        if (findYear) {
          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            result: findYear.result,
            ghichu: findYear.ghichu,
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi
          });

          if (findYear.result === "Hoàn thành xuất sắc nhiệm vụ") {
            total_htxsnv += 1;
          } else if (findYear.result === "Hoàn thành tốt nhiệm vụ") {
            total_httnv += 1;
          } else if (findYear.result === "Hoàn thành nhiệm vụ") {
            total_htnv += 1;
          } else if (findYear.result === "Không hoàn thành nhiệm vụ") {
            total_khtnv += 1;
          };

        } else {
          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            result: "Chưa có dữ liệu",
            ghichu: "",
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi
          });

          total_not_value += 1;
        }
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });
      res.status(200).json({ data, list_doi_option, total_htxsnv, total_not_value, total_htnv, total_httnv, total_khtnv })

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  // danh sách thi đua năm của cán bộ, chiến sĩ theo khoảng thời gian các năm
  getBangThiduanam: async (req, res) => {
    let { tunam, dennam, donvis } = req.query;
    tunam = Number(tunam.value);
    dennam = Number(dennam.value);

    let toTimeNumber = new Date(`${dennam}-12-31`).getTime();

    let data = [];
    let donvis_dang_congtac = [];
    try {
      let dois = await Dois.find({ donvi: { $in: donvis } });
      let dois_id_list = dois.map(i => i._id.toString());
      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: "active",
        chuyencongtacngoaitinh: false
      }).populate('donvi.donvi');

      let totalCanbo = 0;
      let total_htxsnv = 0;
      let total_httnv = 0;
      let total_htnv = 0;
      let total_khtnv = 0;
      let total_not_value = 0;

      for (let i of canhan_tung_congtac_taidoi) {
        let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);
        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        if (!checked) continue;
        totalCanbo += 1;

        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });

        let resultThiduanam = [];
        let total_htxsnv_canhan = 0;
        let total_httnv_canhan = 0;
        let total_htnv_canhan = 0;
        let total_khtnv_canhan = 0;
        let total_not_value_canhan = 0;

        for (let year = dennam; year >= tunam; year--) {
          let findYear = i.thiduanam.find(e => e.thoigian.includes(year));

          let check_nghihuu = (new Date(i.ngaynghihuu)).getTime();
          if (check_nghihuu > (new Date(`${year}-12-31`)).getTime()) continue;

          if (findYear) {
            resultThiduanam.push({ nam: year, result: findYear.result });
            if (findYear.result === "Hoàn thành xuất sắc nhiệm vụ") {
              total_htxsnv += 1;
              total_htxsnv_canhan += 1;
            } else if (findYear.result === "Hoàn thành tốt nhiệm vụ") {
              total_httnv += 1;
              total_httnv_canhan += 1;
            } else if (findYear.result === "Hoàn thành nhiệm vụ") {
              total_htnv += 1;
              total_htnv_canhan += 1;
            } else if (findYear.result === "Không hoàn thành nhiệm vụ") {
              total_khtnv += 1;
              total_khtnv_canhan += 1;
            };
          } else {
            resultThiduanam.push({ nam: year, result: 'Chưa có dữ liệu' });
            total_not_value += 1;
            total_not_value_canhan += 1;
          };
        };

        data.push({
          _id: i._id,
          total_htxsnv_canhan,
          total_httnv_canhan,
          total_htnv_canhan,
          total_khtnv_canhan,
          total_not_value_canhan,
          hoten: i.hoten,
          ngaysinh: i.ngaysinh,
          result: resultThiduanam,
          donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,// đơn vị công tác tính đến hết đến năm
          id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });

      data = data.sort((a, b) => b.total_htxsnv_canhan - a.total_htxsnv_canhan)

      res.status(200).json({ data, list_doi_option, total_htxsnv, total_not_value, total_htnv, total_httnv, total_khtnv })

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },
  getTruongthanhdoans: async (req, res) => {
    let { tungay, denngay, chidoans, hoten } = req.query;


    if (tungay === "") {
      tungay = "1970-01-01"
    };
    if (denngay === "") {
      denngay = "9999-01-01"
    };

    let toTimeNumber = new Date(denngay).getTime();
    let goTimeNumber = new Date(tungay).getTime();

    try {
      //tìm kiếm đoàn viên tính đến thời điểm đến ngày
      let donvis = []; // danh sách các đơn vị thuộc chi đoàn cần tím kiếm
      if (chidoans === "") {
        let userId = req.userId.userId;

        const user = await Users.findOne({ _id: userId }).populate('quantrinhomchidoan').populate('quantrinhomchidoan.nhomdonvithuocchidoan');
        //kiểm tra xem đơn vị nào active thì lấy ra tránh trường hợp đơn vị đã xác nhập rồi nhưng vẫn thêm vào 
        //gây ra tình trạng k đúng theo thực tế
        let chidoans = user.quantrinhomchidoan;

        for (let e of chidoans) {
          donvis = donvis.concat(e.nhomdonvithuocchidoan)
          donvis = _.uniqWith(donvis, _.isEqual); // loại bỏ các phần tử giống nhau
        };
      } else {
        let chidoan = await Chidoans.findById(chidoans).populate('nhomdonvithuocchidoan')
        donvis = chidoan.nhomdonvithuocchidoan;
      };
      let data = []; //result return frontend

      for (let donvi of donvis) {
        let doanvienOfDonvi = await Canbos.find({
          "donvi.donviString": donvi._id,
          "donvi.timeNumber": {
            $lte: toTimeNumber
          },
          trangthai: "active",
          truongthanhdoan: true,
          ngaytruongthanhdoan: {
            $lte: denngay,
            $gte: tungay
          },
          hoten: { $regex: hoten, $options: "i" },
        }, { hoten: 1, donvi: 1, truongthanhdoan: 1, ngaytruongthanhdoan: 1 }).populate('donvi.donvi');

        for (let i of doanvienOfDonvi) {
          let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => b.timeNumber - a.timeNumber);
          let checked = findWithTimeNumber[findWithTimeNumber.length - 1].donviString === donvi._id.toString();
          if (!checked) return;

          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            ngaytruongthanhdoan: i.ngaytruongthanhdoan,
            donvi: i.donvi[findWithTimeNumber.length - 1]
          })
        };
      };

      res.status(200).json(data)

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },
  changeStatusTruongthanhdoan: async (req, res) => {
    let id = req.params.id;
    try {
      await Canbos.findByIdAndUpdate(id, {
        truongthanhdoan: false,
        ngaytruongthanhdoan: ""
      });

      res.status(200).json({ message: "Thay đổi trạng thái trưởng thành đoàn thành công" })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  // sửa mới 2025
  //func lấy ra đơn vị dựa vào vai trò chức năng của tài khoản
  getUserUseVaitro: async (req, res) => {
    let id_user = req.userId.userId;
    let { vaitro } = req.query;
    // console.log(id_user)
    try {
      let data = [];
      let data_doi = [];
      if (vaitro === "Quản trị thông thường") {
        let item = await Users.findById(id_user);
        // console.log(item)
        data.push({ value: item._id.toString(), label: item.tenhienthi, donvi: item._id.toString() });

        let items_doi = await Dois.find({ donvi: id_user, status: true }).sort({ thutu: -1 });
        items_doi = items_doi.map(i => ({ label: i.tendoi, value: i._id.toString(), donvi: i.donviString }));
        data_doi = [{ label: "Tất cả", value: "" }].concat(items_doi);

      } else {

        let items = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true }).sort({ thutu: -1 });
        // console.log(items)
        let items_convert = items.map(i => ({ label: i.tenhienthi, value: i._id.toString(), donvi: i._id.toString() }));
        data = [{ label: "Tất cả", value: "" }].concat(items_convert);

        let arr = [];
        for (let user of items) {
          let items_doi = await Dois.find({ donvi: user._id, status: true }).sort({ thutu: -1 });

          items_doi = items_doi.map(i => ({ label: i.tendoi, value: i._id.toString(), donvi: i.donviString }));
          arr = arr.concat(items_doi)
        };

        data_doi = [{ label: "Tất cả", value: "" }].concat(arr)
      }
      res.status(200).json({ data_donvi: data, data_doi })
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  // thống kê khen thưởng các đơn vị theo khoảng thời gian
  getKhenthuongsTheoThoigian: async (req, res) => {
    try {
      let { tungay, denngay, donvis } = req.query;

      if (tungay === "") {
        tungay = "1970-01-01"
      };
      if (denngay === "") {
        denngay = "9999-01-01"
      };

      let data_tapthe = [];
      let data_canhan = [];

      let donvis_id_list = donvis;
      let khenthuongs_of_donvi = await Khenthuongtapthe.find({
        ngayky: {
          $gte: tungay,
          $lte: denngay,
        },
        tapthe: { $in: donvis_id_list }
      }).populate('tapthe').populate('hinhthuc').populate('capkhen');
      // console.log(khenthuongs_of_donvi)
      for (let khenthuong of khenthuongs_of_donvi) {
        data_tapthe.push({
          soQD: khenthuong.soQD,
          ngayky: khenthuong.ngayky,
          noidung: khenthuong.noidung,
          soQD: khenthuong.soQD,
          hinhthuc: khenthuong.hinhthuc,
          capkhen: khenthuong.capkhen,
          nguoiky: khenthuong.nguoiky,
          doituongkhen: khenthuong.tapthe.tenhienthi,
          id_tapthe: khenthuong.tapthe._id
        })
      };

      let dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
      let dois_id_list = dois.map(i => i._id.toString());
      // console.log(dois)
      let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
        ngayky: {
          $gte: tungay,
          $lte: denngay,
        },
        donvi: { $in: dois_id_list }
      }).populate('tapthe').populate('hinhthuc').populate('capkhen');

      for (let khenthuong of khenthuongs_of_doi) {
        data_tapthe.push({
          soQD: khenthuong.soQD,
          ngayky: khenthuong.ngayky,
          noidung: khenthuong.noidung,
          soQD: khenthuong.soQD,
          hinhthuc: khenthuong.hinhthuc,
          capkhen: khenthuong.capkhen,
          nguoiky: khenthuong.nguoiky,
          doituongkhen: khenthuong.tapthe.tendoi,
          id_tapthe: khenthuong.tapthe._id
        })
      };

      let canbo_of_dois = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list }
      }).populate('donvi.donvi');

      let id_canbo_of_dois = canbo_of_dois.map(i => i._id.toString());

      //khen cá nhân phải check xem thời gian được khen đang công tác tại đơn vị nào
      let khenthuongs_of_canhan = await Khenthuongcanhan.find({
        ngayky: {
          $gte: tungay,
          $lte: denngay,
        },
        canhanduockhenthuong: { $in: id_canbo_of_dois }
      }).populate({
        path: 'canhanduockhenthuong',
        populate: {
          path: "donvi",
          populate: { path: "donvi" }
        },
      }).populate('hinhthuc').populate('capkhen');

      for (let khenthuong of khenthuongs_of_canhan) {
        let timeNumber = new Date(khenthuong.ngayky).getTime();
        let donviFilter = khenthuong.canhanduockhenthuong.donvi.filter(i => i.timeNumber <= timeNumber).sort((a, b) => b.timeNumber - a.timeNumber);

        data_canhan.push({
          soQD: khenthuong.soQD,
          ngayky: khenthuong.ngayky,
          noidung: khenthuong.noidung,
          soQD: khenthuong.soQD,
          hinhthuc: khenthuong.hinhthuc,
          capkhen: khenthuong.capkhen,
          nguoiky: khenthuong.nguoiky,
          doituongkhen: khenthuong.canhanduockhenthuong.hoten,
          donvicongtac_duocgiaykhen: donviFilter[0].donvi.tendoi,
          id_canhan: khenthuong.canhanduockhenthuong._id
        });
      };

      // Tạo một Map để đếm số lượt xuất hiện của từng phần tử dựa trên key là kết hợp doituongkhen + id_tapthe
      const countMap = new Map();
      data_tapthe.forEach(item => {
        const key = `${item.doituongkhen}-${item.id_tapthe}`;
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMap
      const arrTapthe = Array.from(countMap, ([key, soluotkhen]) => {
        const [doituongkhen, id_tapthe] = key.split('-');
        return {
          doituongkhen,
          id_tapthe,
          soluotkhen
        };
      });

      const countMapCanhan = new Map();
      data_canhan.forEach(item => {
        const key = `${item.doituongkhen}-${item.id_canhan}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const arrCanhan = Array.from(countMapCanhan, ([key, soluotkhen]) => {
        const [doituongkhen, id_canhan] = key.split('-');
        return {
          doituongkhen,
          id_canhan,
          soluotkhen
        };
      });

      let data = data_tapthe.concat(data_canhan);
      data.sort((a, b) => {
        let x = new Date(b.ngayky).getTime()
        let y = new Date(a.ngayky).getTime()
        return x - y
      });

      res.status(200).json({ data, dois_id_list, taptheduockhen: arrTapthe, canhanduockhen: arrCanhan, message: "Tìm kiếm khen thưởng thành công" });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  // thống kê kết quả thi đua năm của các đảng viên đang công tác theo năm
  getXeploaiDangvienNam: async (req, res) => {
    let { nam, donvi, vaitro } = req.query;
    // console.log('123')
    let toTimeNumber = new Date(`${nam}-12-31`).getTime();
    // let goTimeNumber = new Date(`${nam}-01-01`).getTime();
    let ngaycuoinam = `${nam}-12-31`;
    // console.log(`${nam - 0o1 - 0o1}`)
    let checked_user_donvi = vaitro === "Quản trị thông thường";
    let data = [];

    let dois = [];
    let dois_id_list = [];
    try {
      //tìm kiếm đoàn viên tính đến thời điểm đến ngày
      if (checked_user_donvi) {
        // console.log('1')
        dois = await Dois.find({ donvi: req.userId.userId }).sort({ thutu: -1 });
        dois_id_list = dois.map(i => i._id.toString());
      } else {
        if (donvi === "") {
          // console.log('2')
          let donvis = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true }).sort({ thutu: -1 });
          let donvis_id_list = donvis.map(i => i._id.toString());

          dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        } else {
          // console.log(3)
          dois = await Dois.find({ donvi: donvi }).sort({ thutu: -1 });
          dois_id_list = dois.map(i => i._id.toString());
        }
      };

      let donvis_dang_congtac = [];
      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: "active",
        chuyencongtacngoaitinh: false,
        dangvien: true,
        ngaynghihuu: { $lte: ngaycuoinam }
      }).populate('donvi.donvi');
      // console.log(canhan_tung_congtac_taidoi)
      let totalCanbo = 0;
      let total_htxsnv = 0;
      let total_httnv = 0;
      let total_htnv = 0;
      let total_khtnv = 0;
      let total_not_value = 0;
      for (let i of canhan_tung_congtac_taidoi) {
        let check_nghihuu = (new Date(i.ngaynghihuu)).getTime();
        if (check_nghihuu > toTimeNumber) continue;

        let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);
        //  console.log(findWithTimeNumber)
        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        if (!checked) continue;
        totalCanbo += 1;

        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });
        let findYear = i.xeploaidangvien.find(e => e.thoigian.includes(nam));


        if (findYear) {
          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            result: findYear.result,
            ghichu: findYear.ghichu,
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi
          });

          if (findYear.result === "Hoàn thành xuất sắc nhiệm vụ") {
            total_htxsnv += 1;
          } else if (findYear.result === "Hoàn thành tốt nhiệm vụ") {
            total_httnv += 1;
          } else if (findYear.result === "Hoàn thành nhiệm vụ") {
            total_htnv += 1;
          } else if (findYear.result === "Không hoàn thành nhiệm vụ") {
            total_khtnv += 1;
          };

        } else {
          data.push({
            _id: i._id,
            hoten: i.hoten,
            ngaysinh: i.ngaysinh,
            nghihuu: i.nghihuu,
            ngaynghihuu: i.ngaynghihuu,
            result: "Chưa có dữ liệu",
            ghichu: "",
            id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id,
            donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi
          });

          total_not_value += 1;
        }
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });
      res.status(200).json({ data, list_doi_option, total_htxsnv, total_not_value, total_htnv, total_httnv, total_khtnv })

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  getBangXeploaiDangvienQuaCacNam: async (req, res) => {
    let { tunam, dennam, donvis } = req.query;
    tunam = Number(tunam.value);
    dennam = Number(dennam.value);

    let toTimeNumber = new Date(`${dennam}-12-31`).getTime();

    let data = [];
    let donvis_dang_congtac = [];
    try {
      let dois = await Dois.find({ donvi: { $in: donvis } });
      let dois_id_list = dois.map(i => i._id.toString());
      let canhan_tung_congtac_taidoi = await Canbos.find({
        'donvi.donvi': { $in: dois_id_list },
        trangthai: "active",
        chuyencongtacngoaitinh: false
      }).populate('donvi.donvi');

      let totalCanbo = 0;
      let total_htxsnv = 0;
      let total_httnv = 0;
      let total_htnv = 0;
      let total_khtnv = 0;
      let total_not_value = 0;

      for (let i of canhan_tung_congtac_taidoi) {
        let findWithTimeNumber = i.donvi.filter(e => e.timeNumber <= toTimeNumber).sort((a, b) => a.timeNumber - b.timeNumber);
        if (findWithTimeNumber.length === 0) continue;
        let checked = dois_id_list.includes(findWithTimeNumber[findWithTimeNumber.length - 1].donviString);
        if (!checked) continue;
        totalCanbo += 1;
        // console.log('123')
        donvis_dang_congtac.push({
          label: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,
          value: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });

        let resultThiduanam = [];
        let total_htxsnv_canhan = 0;
        let total_httnv_canhan = 0;
        let total_htnv_canhan = 0;
        let total_khtnv_canhan = 0;
        let total_not_value_canhan = 0;

        for (let year = dennam; year >= tunam; year--) {

          let findYear = i.xeploaidangvien.find(e => e.thoigian.includes(year));

          let check_nghihuu = (new Date(i.ngaynghihuu)).getTime();
          if (check_nghihuu > (new Date(`${year}-12-31`)).getTime()) continue;

          if (findYear) {
            resultThiduanam.push({ nam: year, result: findYear.result });
            if (findYear.result === "Hoàn thành xuất sắc nhiệm vụ") {
              total_htxsnv += 1;
              total_htxsnv_canhan += 1;
            } else if (findYear.result === "Hoàn thành tốt nhiệm vụ") {
              total_httnv += 1;
              total_httnv_canhan += 1;
            } else if (findYear.result === "Hoàn thành nhiệm vụ") {
              total_htnv += 1;
              total_htnv_canhan += 1;
            } else if (findYear.result === "Không hoàn thành nhiệm vụ") {
              total_khtnv += 1;
              total_khtnv_canhan += 1;
            };
          } else {
            resultThiduanam.push({ nam: year, result: 'Chưa có dữ liệu' });
            total_not_value += 1;
            total_not_value_canhan += 1;
          };
        };

        data.push({
          _id: i._id,
          total_htxsnv_canhan,
          total_httnv_canhan,
          total_htnv_canhan,
          total_khtnv_canhan,
          total_not_value_canhan,
          hoten: i.hoten,
          ngaysinh: i.ngaysinh,
          result: resultThiduanam,
          donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi.tendoi,// đơn vị công tác tính đến hết đến năm
          id_donvidangcongtac: findWithTimeNumber[findWithTimeNumber.length - 1].donvi._id
        });
      };

      const countMapCanhan = new Map();
      donvis_dang_congtac.forEach(item => {
        const key = `${item.label}-${item.value}`;
        countMapCanhan.set(key, (countMapCanhan.get(key) || 0) + 1);
      });

      // Tạo mảng kết quả bằng cách duyệt qua countMapCanhan
      const list_doi_option = Array.from(countMapCanhan, ([key]) => {
        const [label, value] = key.split('-');
        return {
          label,
          value,
        };
      });

      data = data.sort((a, b) => b.total_htxsnv_canhan - a.total_htxsnv_canhan)

      res.status(200).json({ data, list_doi_option, total_htxsnv, total_not_value, total_htnv, total_httnv, total_khtnv })

    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  getDanhhieuThiduaThongke: async (req, res) => {
    let { nam, cap } = req.query;
    nam = Number(nam);
    // console.log(req.query)
    let data = [];
    try {
      if (cap === "Cấp Phòng") {
        data = await Danhhieuthiduas.find({ nam }).populate('tapthe', { tenhienthi: 1 })
        data = data.map(i => ({
          ...i._doc, tapthe: i.tapthe.tenhienthi
        }));
      } else {
        data = await DanhhieuthiduasCapdois.find({ nam }).populate('tapthe')
        data = data.map(i => ({
          ...i._doc, tapthe: i.tapthe.tendoi
        }));
      };
      res.status(200).json(data)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  getNumberCanboOrDangvienDangCongtac: async (req, res) => {
    let { vaitro } = req.query;
    try {
      let data = [];

      if (vaitro === "Quản trị thông thường") {
        let userId = req.userId.userId;
        // danh sach cac doi, to cong tac thuoc tai khoan
        let quantrinhomdonvi = await Dois.find({ donvi: userId, status: true }).sort({ thutu: 1 });
        quantrinhomdonvi = quantrinhomdonvi.map(i => i._id.toString());

        data = await Canbos.aggregate([
          {
            $project: {
              donvi: {
                $arrayElemAt: [
                  "$donvi",
                  {
                    $indexOfArray: [
                      "$donvi.timeNumber", // tra ve array chi chua cac timeNumber
                      { $max: "$donvi.timeNumber" }, // laasy ra max timenumer
                    ],
                  },
                ],
              },
              bacham: {
                $arrayElemAt: [
                  "$bacham",
                  {
                    $indexOfArray: [
                      "$bacham.timeNumber",
                      { $max: "$bacham.timeNumber" },
                    ],
                  },
                ],
              },
              chucvu: {
                $arrayElemAt: [
                  "$chucvu",
                  {
                    $indexOfArray: [
                      "$chucvu.timeNumber",
                      { $max: "$chucvu.timeNumber" },
                    ],
                  },
                ],
              },
              hoten: 1,
              trangthai: 1,
              gioitinh: 1,
              dangvien: 1,
              doanvien: 1,
              ngayvaodang: 1,
              ngaysinh: 1,
              nghihuu: 1,
              truongthanhdoan: 1,
              ngaytruongthanhdoan: 1,
              chuyencongtacngoaitinh: 1,
              yeucauChuyencongtac: 1
            },
          },
          {
            $match: {
              $and: [
                { "donvi.donviString": { $in: quantrinhomdonvi } },
                { trangthai: "active" },
                { chuyencongtacngoaitinh: false },
                { nghihuu: false }
              ],
            },
          }
        ]);

      } else {
        data = await Canbos.aggregate([
          {
            $match: {
              $and: [
                { trangthai: "active" },
                { chuyencongtacngoaitinh: false },
                { nghihuu: false }
              ],
            },
          }
        ]);
      };

      let dangviens = data.filter(i => i.dangvien === true);
      let nam_canbos = data.filter(i => i.gioitinh === "Nam").length;
      let nu_canbos = data.length - nam_canbos;

      let nam_dangviens = dangviens.filter(i => i.gioitinh === "Nam").length;

      let nu_dangviens = dangviens.length - nam_dangviens;
      console.log(nu_dangviens)
      res.status(200).json({ nam_canbos, nu_canbos, numbers_canbo: data.length, numbers_dangvien: dangviens.length, nam_dangviens, nu_dangviens });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },

  getNumberKhenthuongs: async (req, res) => {
    let { vaitro } = req.query;
    try {

      let donvis_id_list = [];

      if (vaitro === "Quản trị thông thường") {
        donvis_id_list = [req.userId.userId]
      } else {
        let donvis = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true }).sort({ thutu: -1 });
        donvis_id_list = donvis.map(i => i._id.toString());
      };

      let khenthuongs_of_donvi = await Khenthuongtapthe.find({
        tapthe: { $in: donvis_id_list }
      });

      let dois = await Dois.find({ donvi: { $in: donvis_id_list } }).sort({ thutu: -1 });
      let dois_id_list = dois.map(i => i._id.toString());

      let khenthuongs_of_doi = await KhenthuongtaptheCapdoi.find({
        donvi: { $in: dois_id_list }
      });

      //cán bộ hiện đang công tác tại đơn vị
      let canbo_of_dois = await Canbos.aggregate([
        {
          $project: {
            donvi: {
              $arrayElemAt: [
                "$donvi",
                {
                  $indexOfArray: [
                    "$donvi.timeNumber", // tra ve array chi chua cac timeNumber
                    { $max: "$donvi.timeNumber" }, // laasy ra max timenumer
                  ],
                },
              ],
            },
            hoten: 1,
            trangthai: 1,
            gioitinh: 1,
            dangvien: 1,
            doanvien: 1,
            ngayvaodang: 1,
            ngaysinh: 1,
            nghihuu: 1,
            truongthanhdoan: 1,
            ngaytruongthanhdoan: 1,
            chuyencongtacngoaitinh: 1,
            yeucauChuyencongtac: 1
          },
        },
        {
          $match: {
            $and: [
              { "donvi.donviString": { $in: dois_id_list } },
              { trangthai: "active" },
              { chuyencongtacngoaitinh: false },
              { nghihuu: false }
            ],
          },
        }
      ]);

      let id_canbo_of_dois = canbo_of_dois.map(i => i._id.toString());

      let khenthuongs_of_canhan = await Khenthuongcanhan.find({
        canhanduockhenthuong: { $in: id_canbo_of_dois }
      });

      let kiluats_of_canhan = await Kiluatcanhan.find({
        canhanbikiluat: { $in: id_canbo_of_dois }
      });

      let number_khenthuongs_of_tapthe = khenthuongs_of_donvi.length + khenthuongs_of_doi.length;
      let number_khenthuongs_of_canhan = khenthuongs_of_canhan.length;

      res.status(200).json({ number_khenthuongs_of_tapthe, number_khenthuongs_of_canhan, number_kiluats_of_canhan: kiluats_of_canhan.length });
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },
  reportDonviChuaSaveThiduathang: async (req, res) => {
    let { month, year } = req.query;
    try {
      let filterDonvis = await Users.find({ vaitro: "Quản trị thông thường", trangthai: true });
      let data = [];
      for (let donvi of filterDonvis) {
        let checked = await HistoriesSystem.findOne({
          user: donvi._id,
          action: { $regex: `Lưu kết quả thi đua tháng ${month} năm ${year}`, $options: "i" },
        }).populate('user', { tenhienthi: 1 });

        if (checked) continue;

        data.push({
          donvi: donvi.tenhienthi
        })
      };

      res.status(200).json(data)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message:
          "Có lỗi xảy ra. Vui lòng liên hệ quản trị hệ thống.",
      });
    }
  },
  fetchLichsuHethong: async (req, res) => {
    try {
      let { tentaikhoan, tungay, denngay, action, id } = req.query;

      const schema = Joi.object({
        id: Joi.string().required(),
        // action: Joi.string().optional(),
        tungay: Joi.string().optional(),
        denngay: Joi.string().optional(),
      });

      if (tungay === "") {
        tungay = "1970-01-01"
      };
      const { error, value } = schema.validate({
        id: id, tungay, denngay
      });
      tungay = value.tungay;

      denngay = value.denngay;
      if (error) {
        return res.status(400).json({ status: false, message: 'Lỗi giá trị đầu vào' + error.message });
      };
      if (tungay === "") {
        tungay = new Date("1970-01-01T00:00:00Z");
      } else {
        tungay = new Date(`${tungay}T00:00:00Z`)
      }
      // console.log(action)
      denngay = new Date(`${denngay}T23:59:59Z`);

      let accounts_con = await Users.find({ capcha: value.id });
      accounts_con = accounts_con.map(i => i._id)
      let items = await HistoriesSystem.find({
        action: { $regex: action, $options: "i" },
        user: { $in: accounts_con },
        createdAt: {
          $gte: tungay,
          $lte: denngay,
        }
      }).populate("user").sort({ createdAt: -1 });
      // console.log(items[0])
      items = items.filter(i => i.user.tenhienthi.toLowerCase().indexOf(tentaikhoan.toLowerCase()) !== -1)
      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

  searchCanbo: async (req, res) => {
    try {
      let { hoten, donvi, doi } = req.query;
      donvi = donvi.value;
      doi = doi.value;

      let donvis = [];
      if (donvi === "") {
        let users = await Users.find({ vaitro: "Quản trị thông thường" }).sort({ thutu: -1 });
        donvis = users.map(i => i._id.toString());
      } else {
        donvis = [donvi]
      };
      const schema = Joi.object({
        // id: Joi.string().required(),
        // action: Joi.string().optional(),
        // tungay: Joi.string().optional(),
        // denngay: Joi.string().optional(),
      });

      let quantrinhomdonvi = await Dois.find({ donvi: { $in: donvis }, status: true }).sort({ thutu: 1 });
      quantrinhomdonvi = quantrinhomdonvi.map(i => i._id.toString());

      let items = await Canbos.aggregate([
        {
          $project: {
            donvi: {
              $arrayElemAt: [
                "$donvi",
                {
                  $indexOfArray: [
                    "$donvi.timeNumber", // tra ve array chi chua cac timeNumber
                    { $max: "$donvi.timeNumber" }, // laasy ra max timenumer
                  ],
                },
              ],
            },
            bacham: {
              $arrayElemAt: [
                "$bacham",
                {
                  $indexOfArray: [
                    "$bacham.timeNumber",
                    { $max: "$bacham.timeNumber" },
                  ],
                },
              ],
            },
            chucvu: {
              $arrayElemAt: [
                "$chucvu",
                {
                  $indexOfArray: [
                    "$chucvu.timeNumber",
                    { $max: "$chucvu.timeNumber" },
                  ],
                },
              ],
            },
            hoten: 1,
            trangthai: 1,
            gioitinh: 1,
            dangvien: 1,
            doanvien: 1,
            ngayvaodang: 1,
            ngaysinh: 1,
            nghihuu: 1,
            truongthanhdoan: 1,
            ngaytruongthanhdoan: 1,
            chuyencongtacngoaitinh: 1,
            yeucauChuyencongtac: 1
          },
        },
        {
          $match: {
            $and: [
              { "donvi.donviString": { $regex: doi, $options: "i" } },
              { "donvi.donviString": { $in: quantrinhomdonvi } },
              { hoten: { $regex: hoten, $options: "i" } },
              { trangthai: "active" }
            ],
          },
        },
        {
          $lookup: {
            from: "bachams",
            localField: "bacham.bacham",
            foreignField: "_id",
            as: "bachamPopulate",
          },
        },
        {
          $lookup: {
            from: "chucvus",
            localField: "chucvu.chucvu",
            foreignField: "_id",
            as: "chucvuPopulate",
          },
        },
        {
          $lookup: {
            from: "dois",
            localField: "donvi.donvi",
            foreignField: "_id",
            as: "donviPopulate",
          },
        },{
          $unwind: "$donviPopulate"
        },{
           $lookup: {
            from: "users",
            localField: "donviPopulate.donvi",
            foreignField: "_id",
            as: "accounts",
          }
        },{
            $project:{
            hoten: 1,
            trangthai: 1,
            gioitinh: 1,
            dangvien: 1,
            ngaysinh: 1,
            nghihuu: 1,
            ngaytruongthanhdoan: 1,
            chuyencongtacngoaitinh: 1,
            accounts: "$accounts.tenhienthi",
            bachamPopulate: 1,
            chucvuPopulate: 1,
            donviPopulate: 1
            }
        }
      ]).sort({ thutu: 1 });

      res.status(200).json(items)
    } catch (error) {
      console.log("lỗi: ", error.message);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },

};
