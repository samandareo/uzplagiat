---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- generated_from_trainer
- dataset_size:4356
- loss:ContrastiveLoss
base_model: tahrirchi/tahrirchi-bert-base
widget:
- source_sentence: fermer xoʻjaliklarida mehnat unumdorligini oshirish, mahsulot sifatini
    yaxshilash, yuqori qoʻshilgan qiymat yaratishga qaratilgan tarmoq dasturlarini
    ishlab chiqish orqali davlat xarajatlari samaradorligini oshirish va bosqichma-bosqich
    qayta taqsimlash;
  sentences:
  - ko‘plab informatika o‘qituvchilari kompyuter savodxonligiga ega bo‘lsa-da, zamonaviy
    o‘qitish metodlaridan foydalanishda qiynaladilar.
  - issiq haroratni pasaytirish va tizim mustahkamligini ushlab turish uchun havo-suv
    kompozitli sovitish eng ideal tanlov sanaladi.
  - dehqonlarning kundalik ish faoliyati samaradorligini yuksaltirish va yetishtirilgan
    iste'mol ne'matlari darajasini ko'tarish orqali hukumat moliyaviy sarflarini maqbullashtirishga
    qaratilgan aniq sohaviy dasturlarni hayotga tatbiq etish shart.
- source_sentence: maydanak observatoriyasida 12 yillik oʻlchashlar davomida 400 mingdan
    ortiq qiymatlar olindi.
  sentences:
  - meditsina tarjimasi deganda asosan kasallik varaqalari, vrach xulosalari hamda
    dori-darmon ko'rsatmalarini o'zga lisonlarga o'girish amaliyoti tushuniladi.
  - issiqlik uzatish maydoni ortishi bilan suyuqlik va plastinka orasida issiqlik
    almashinuvi yaxshilanadi.
  - si marketing asoslarini joriy qilish uchun 4 ta asosiy strategik yo'nalish mavjud.
- source_sentence: an'anaviy reklama o'rnini seo, smm kabi raqamli usullar egallamoqda.
  sentences:
  - xalqaro sertifikatlash (google, meta) tizimlarini darslarga joriy qilish yaxshi
    natija beradi.
  - ma'lumotlar tahliliga asoslanib aytish mumkinki, rasadxonada olib borilgan to'rt
    yuz yigirma olti mingta o'lchov ishlari kechasi o'rtacha namlik ellik foiz atrofida
    bo'lishini tasdiqlagan.
  - o'g'itning suvda qiyin erishi muammosini hal qilish uchun uning tarkibiga olma
    kislotasi kabi begona reaktivlarni qo'shish tadqiq qilindi.
- source_sentence: ko‘plab informatika o‘qituvchilari kompyuter savodxonligiga ega
    bo‘lsa-da, zamonaviy o‘qitish metodlaridan foydalanishda qiynaladilar.
  sentences:
  - vesalius (1514—1564) anatomiya sohasida inqilob yasab, antik davr g'oyalarini
    tajriba asosida rad etdi.
  - 'amaliy izlanishlarga tayangan pedagogikani qo''llash: maktab o''quvchilarini
    jamoalarga ajratib, hayotiy ziddiyatlarga yechim bo''luvchi ixcham kompyuter dasturlarini
    yaratishga o''rgatish maqsadga muvofiq.'
  - yigirma birinchi yuz yillikda axborot-kommunikatsiya texnologiyalari xodimlarining
    vakolatlarini belgilash hamda ularni nazorat qilish maqsadida yaratilgan ko'plab
    namunalarning asosi sifatida axborot davri uchun zarur bo'lgan malakalar chegarasi
    e'tirof etiladi.
- source_sentence: farg‘ona vodiysida shishadan yasalgan buyumlar jez davridan uchraydi
    va keyingi davrlarda shisha buyumlar soni ortib boradi.
  sentences:
  - uning "al-qonun fit-tibb" (tibbiyot qonunlari) asari besh jilddan iborat bo'lib,
    tibbiy bilimni tizimlashtirgan va asrlar davomida sharq va g'arbda darslik vazifasini
    o'tagan.
  - sun'iy intellektga tayangan o'qitish dasturlari bevosita yoshlarning bilim darajasiga
    qarab individuallashgan ta'lim muhitini yaratib beradi.
  - 'farg‘ona xalqlari ilk shisha idishlari: piyola, kosa, qadah kabi ko‘plab idishlar
    bilan antik davrda tanishganlar.'
pipeline_tag: sentence-similarity
library_name: sentence-transformers
---

# SentenceTransformer based on tahrirchi/tahrirchi-bert-base

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [tahrirchi/tahrirchi-bert-base](https://huggingface.co/tahrirchi/tahrirchi-bert-base). It maps sentences & paragraphs to a 768-dimensional dense vector space and can be used for retrieval.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [tahrirchi/tahrirchi-bert-base](https://huggingface.co/tahrirchi/tahrirchi-bert-base) <!-- at revision e9961825524fe3dfc2b7e73612a4f6c3b1cf0251 -->
- **Maximum Sequence Length:** 512 tokens
- **Output Dimensionality:** 768 dimensions
- **Similarity Function:** Cosine Similarity
- **Supported Modality:** Text
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/huggingface/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'transformer_task': 'feature-extraction', 'modality_config': {'text': {'method': 'forward', 'method_output_name': 'last_hidden_state'}}, 'module_output_name': 'token_embeddings', 'architecture': 'BertModel'})
  (1): Pooling({'embedding_dimension': 768, 'pooling_mode': 'mean', 'include_prompt': True})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```
Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'farg‘ona vodiysida shishadan yasalgan buyumlar jez davridan uchraydi va keyingi davrlarda shisha buyumlar soni ortib boradi.',
    'farg‘ona xalqlari ilk shisha idishlari: piyola, kosa, qadah kabi ko‘plab idishlar bilan antik davrda tanishganlar.',
    "sun'iy intellektga tayangan o'qitish dasturlari bevosita yoshlarning bilim darajasiga qarab individuallashgan ta'lim muhitini yaratib beradi.",
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 768]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[1.0000, 0.5229, 0.1722],
#         [0.5229, 1.0000, 0.1882],
#         [0.1722, 0.1882, 1.0000]])
```
<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 4,356 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 1000 samples:
  |         | sentence_0                                                                        | sentence_1                                                                        | label                                                          |
  |:--------|:----------------------------------------------------------------------------------|:----------------------------------------------------------------------------------|:---------------------------------------------------------------|
  | type    | string                                                                            | string                                                                            | float                                                          |
  | details | <ul><li>min: 9 tokens</li><li>mean: 25.79 tokens</li><li>max: 76 tokens</li></ul> | <ul><li>min: 7 tokens</li><li>mean: 27.69 tokens</li><li>max: 66 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.48</li><li>max: 1.0</li></ul> |
* Samples:
  | sentence_0                                                                                                                                   | sentence_1                                                                                                                                                                                            | label            |
  |:---------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------|
  | <code>xxi asr texnologiyalari asri deb bejizga atalmaydi.</code>                                                                             | <code>biroq bu jarayon infratuzilma, kadrlar salohiyati va raqamli madaniyat rivojiga bogʻliqdir.</code>                                                                                              | <code>0.0</code> |
  | <code>axborot tizimlarining ta'limdagi rollaridan biri bu zarur bo'lgan ma'lumotlarni zarur bo'lganda etkazib berishni ta'minlashdir.</code> | <code>kompyuter ilmlarining pedagogikadagi eng birlamchi funksiyalaridan biri shuki, u barchaga xohlagan paytida va joyida o'ziga ehtiyoj tug'ilgan axborotlarni zudlik bilan yetkazib beradi.</code> | <code>1.0</code> |
  | <code>ikki qatlamli mikrokanalli issiqlik almashgichda harorat birtekisligi yaxshilangan.</code>                                             | <code>mikrokanallarning ikki qavatli bo'lishi tizim ichidagi temperaturaning bir maromda taqsimlanishiga yordam bergan.</code>                                                                        | <code>1.0</code> |
* Loss: [<code>ContrastiveLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#contrastiveloss) with these parameters:
  ```json
  {
      "distance_metric": "SiameseDistanceMetric.COSINE_DISTANCE",
      "margin": 0.5,
      "size_average": true
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `per_device_train_batch_size`: 16
- `per_device_eval_batch_size`: 16
- `num_train_epochs`: 4
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `do_predict`: False
- `eval_strategy`: no
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 16
- `per_device_eval_batch_size`: 16
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 4
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: None
- `warmup_ratio`: None
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `enable_jit_checkpoint`: False
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `use_cpu`: False
- `seed`: 42
- `data_seed`: None
- `bf16`: False
- `fp16`: False
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: -1
- `ddp_backend`: None
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `parallelism_config`: None
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch_fused
- `optim_args`: None
- `group_by_length`: False
- `length_column_name`: length
- `project`: huggingface
- `trackio_space_id`: trackio
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `hub_revision`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `auto_find_batch_size`: False
- `full_determinism`: False
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `include_num_input_tokens_seen`: no
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: True
- `use_cache`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
| Epoch  | Step | Training Loss |
|:------:|:----:|:-------------:|
| 3.6496 | 500  | 0.0067        |


### Training Time
- **Training**: 4.5 minutes

### Framework Versions
- Python: 3.12.13
- Sentence Transformers: 5.4.0
- Transformers: 5.0.0
- PyTorch: 2.10.0+cu128
- Accelerate: 1.13.0
- Datasets: 4.8.5
- Tokenizers: 0.22.2

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

#### ContrastiveLoss
```bibtex
@inproceedings{hadsell2006dimensionality,
    author={Hadsell, R. and Chopra, S. and LeCun, Y.},
    booktitle={2006 IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR'06)},
    title={Dimensionality Reduction by Learning an Invariant Mapping},
    year={2006},
    volume={2},
    number={},
    pages={1735-1742},
    doi={10.1109/CVPR.2006.100}
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->